import {
    CancelWorkerError,
    cleanWaitingJobsOfType,
    getOrCreateWorkerQueue,
} from './index';
// @ts-expect-error TS(2792): Cannot find module 'uuid'. Did you mean to install... Remove this comment to see the full error message
import { disableFusible } from '@ezs/core/fusible';

import { ProgressStatus } from '@lodex/common';
import type Bull from 'bull';
import getLogger from '../services/logger';
import progress from '../services/progress';
import type { AppContext } from '../services/repositoryMiddleware';
import { handleEnrichmentError } from './enricher';
import { notifyListeners } from './import';

export const jobLogger = {
    info: (job: any, message: any) => {
        if (!job) {
            return;
        }
        const logger = getLogger(job.data.tenant);
        logger.debug(message);
        job.log(message);
    },
    error: (job: any, message: any) => {
        if (!job) {
            return;
        }
        const logger = getLogger(job.data.tenant);
        logger.error(message);
        job.log(message);
    },
};

export const getActiveJobs = async (tenant: string): Promise<Bull.Job[]> => {
    const activeJobs =
        (await getOrCreateWorkerQueue(tenant, 1).getActive()) || [];

    return activeJobs;
};

export const getActiveJob = async (
    tenant: string,
): Promise<Bull.Job | undefined> => {
    const activeJobs = await getActiveJobs(tenant);
    return activeJobs?.[0] || undefined;
};

export const getcompletedJobs = async (tenant: any) => {
    const completedJobs =
        (await getOrCreateWorkerQueue(tenant, 1).getCompleted()) || null;

    if (completedJobs.length === 0) {
        return undefined;
    }
    return completedJobs;
};

export const getWaitingJobs = async (tenant: string): Promise<Bull.Job[]> => {
    const waitingJobs = await getOrCreateWorkerQueue(tenant, 1).getWaiting();

    if (waitingJobs.length === 0) {
        return [];
    }
    return waitingJobs;
};

export const cancelJob = async (
    ctx: AppContext,
    jobType: string,
    subLabel: string | undefined | null = null,
) => {
    const activeJob = await getActiveJob(ctx.tenant);
    if (activeJob?.data?.fusible) {
        await disableFusible(activeJob.data.fusible);
    }
    if (activeJob?.data?.jobType === jobType) {
        if (jobType === 'publisher') {
            await cleanWaitingJobsOfType(ctx.tenant, activeJob!.data.jobType);
        }

        activeJob!.moveToFailed(new Error('cancelled'), true);
        progress.finish(ctx.tenant);
        return;
    }

    if (subLabel) {
        const completedJobs = await getcompletedJobs(ctx.tenant);
        const jobToFail = completedJobs?.find(
            (job: any) => job.data.subLabel === subLabel,
        );
        // get precomputed job
        const precomputedID = jobToFail?.data?.id;
        await ctx.precomputed.updateStatus(precomputedID, ProgressStatus.ERROR);
        progress.finish(ctx.tenant);
        notifyListeners(`${jobToFail?.data?.tenant}-precomputer`, {
            isPrecomputing: false,
            success: false,
        });
        return;
    }
};

export const dropJobs = async (tenant: string, jobType: string) => {
    const jobs = await getOrCreateWorkerQueue(tenant, 1)?.getJobs([
        'completed',
        'waiting',
        'active',
        'delayed',
        'failed',
        'paused',
    ]);
    jobs.forEach((job) => {
        if (!jobType || job?.data?.jobType === jobType) job.remove();
    });
};

export const clearJobs = async (ctx: AppContext) => {
    const waitingJobs = await getWaitingJobs(ctx.tenant);
    const waitingJobIds = waitingJobs.map((job) => job.data.id) || [];
    for (const waitingJob of waitingJobs) {
        waitingJob.remove();
        if (waitingJob.name === 'enricher') {
            await handleEnrichmentError(waitingJob, CancelWorkerError);
        }
    }
    const activeJobs = await getActiveJobs(ctx.tenant);

    const activeJobIds = activeJobs.map((job) => job.data.id) || [];

    for (const activeJob of activeJobs) {
        if (activeJob.name === 'enricher') {
            await handleEnrichmentError(activeJob, CancelWorkerError);
        }
        activeJob.moveToFailed(new Error('cancelled'), true);
    }

    await ctx.precomputed.cancelByIds([...waitingJobIds, ...activeJobIds]);
    await ctx.enrichment.cancelByIds([...waitingJobIds, ...activeJobIds]);

    progress.finish(ctx.tenant);
};
