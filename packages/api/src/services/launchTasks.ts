import { randomUUID } from 'node:crypto';

import { TaskStatus } from '@lodex/common';
import type { DataSourceService } from '../models/dataSource';
import type { EnrichmentCollection } from '../models/enrichment';
import type { PrecomputedCollection } from '../models/precomputed';
import { getOrCreateWorkerQueue } from '../workers';
import { ENRICHER } from '../workers/enricher';
import { PRECOMPUTER } from '../workers/precomputer';

// The subset of AppContext used to queue a launch. It does not rely on any
// Koa request field, so it can also be built by repositoryMiddleware outside
// of an HTTP request.
export type LaunchContext = {
    tenant: string;
    enrichment: EnrichmentCollection;
    precomputed: PrecomputedCollection;
    dataset: { removeAttribute(attribute: string): Promise<unknown> };
    dataSource: Pick<DataSourceService, 'removeAttribute'>;
};

// Write PENDING before queuing the job: the worker can pick it up and set
// IN_PROGRESS before add() resolves, and PENDING would then overwrite it.
export const queueEnrichmentJob = async (
    ctx: Pick<LaunchContext, 'tenant' | 'enrichment'>,
    id: string,
    jobType: string,
    {
        jobId = randomUUID(),
        ...options
    }: Record<string, unknown> & {
        jobId?: string;
    } = {},
) => {
    await ctx.enrichment.updateStatus(id, TaskStatus.PENDING, { jobId });
    return getOrCreateWorkerQueue(ctx.tenant, 1).add(
        jobType,
        { id, jobType, tenant: ctx.tenant },
        { jobId, ...options },
    );
};

export const queueEnrichment = async (
    ctx: LaunchContext,
    id: string,
    {
        relaunch = false,
        lifo,
        jobId,
    }: { relaunch?: boolean; lifo?: boolean; jobId?: string } = {},
): Promise<void> => {
    if (relaunch) {
        const enrichment = await ctx.enrichment.findOneById(id);
        if (!enrichment) {
            throw new Error(`Enrichment "${id}" not found`);
        }
        await ctx.dataSource.removeAttribute(
            enrichment.dataSource,
            enrichment.name,
        );
    }
    // Only pass lifo when given: an undefined lifo would override the
    // queue's default (lifo: true)
    await queueEnrichmentJob(ctx, id, ENRICHER, {
        jobId,
        ...(lifo === undefined ? {} : { lifo }),
    });
};

export const queuePrecomputed = async (
    ctx: LaunchContext,
    id: string,
    {
        relaunch = false,
        jobId = randomUUID(),
    }: { relaunch?: boolean; jobId?: string } = {},
): Promise<void> => {
    const precomputed = await ctx.precomputed.findOneById(id);
    if (!precomputed) {
        throw new Error(`Precomputed "${id}" not found`);
    }
    if (relaunch) {
        await ctx.dataset.removeAttribute(precomputed.name);
    }

    // Write PENDING before queuing the job, for the same reason as for the
    // enrichments (see queueEnrichmentJob).
    await ctx.precomputed.updateStatus(id, TaskStatus.PENDING, {
        hasData: false,
        jobId,
    });
    await getOrCreateWorkerQueue(ctx.tenant, 1).add(
        PRECOMPUTER, // Name of the job
        {
            id,
            jobType: PRECOMPUTER,
            action: 'askForPrecomputed',
            tenant: ctx.tenant,
            subLabel: precomputed.name,
        },
        { jobId },
    );
};
