import {
    CancelWorkerError,
    cleanWaitingJobsOfType,
    getOrCreateWorkerQueue,
    waitForRunningJob,
} from './index';
import { disableFusible } from '@ezs/core/fusible';

import { ProgressStatus } from '@lodex/common';
import type Bull from 'bull';
import getLogger, { parseJobMessage } from '../services/logger';
import progress from '../services/progress';
import type { AppContext } from '../services/repositoryMiddleware';
import { handleEnrichmentError } from './enricher';
import { cancelImportJob, IMPORT, notifyListeners } from './import';
import { PUBLISHER } from './publisher';

export const jobLogger = {
    info: (job: any, message: any) => {
        if (!job) {
            return;
        }
        const { level, text } = parseJobMessage(message);
        // row errors (e.g. "Error enriching #id") must stay visible in production
        getLogger(job.data.tenant).log(
            level === 'error' ? 'error' : 'debug',
            text,
        );
        job.log(message);
    },
    error: (job: any, message: any) => {
        if (!job) {
            return;
        }
        const logger = getLogger(job.data.tenant);
        logger.error(parseJobMessage(message).text);
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
    // Also called outside of a Koa request (site generation)
    ctx:
        | AppContext
        | { tenant: string; precomputed: AppContext['precomputed'] },
    jobType: string,
    subLabel: string | undefined | null = null,
) => {
    const activeJob = await getActiveJob(ctx.tenant);
    // cancelling an import must not stop another job. Other types are not
    // compared: a retry enrichment (retry-enricher) is cancelled as enricher
    const isOtherJobThanImport =
        jobType === 'import' && activeJob?.data?.jobType !== 'import';
    if (activeJob?.data?.fusible && !isOtherJobThanImport) {
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
        // stops the ezs pipeline (breakers), as cancelJob does
        if (activeJob.data?.fusible) {
            await disableFusible(activeJob.data.fusible);
        }
        if (activeJob.name === 'enricher') {
            await handleEnrichmentError(activeJob, CancelWorkerError);
        }
        activeJob.moveToFailed(new Error('cancelled'), true);
    }

    await ctx.precomputed.cancelByIds([...waitingJobIds, ...activeJobIds]);
    await ctx.enrichment.cancelByIds([...waitingJobIds, ...activeJobIds]);

    progress.finish(ctx.tenant);
};

export const queuePublisher = (tenant: string, jobId: string) =>
    getOrCreateWorkerQueue(tenant, 1).add(
        PUBLISHER,
        { jobType: PUBLISHER, tenant },
        { jobId },
    );

// null once the job is gone: Bull only keeps the last finished jobs
export const getJobState = async (tenant: string, jobId: string) => {
    const job = await getOrCreateWorkerQueue(tenant, 1).getJob(jobId);
    if (!job) {
        return null;
    }
    return { state: await job.getState(), failedReason: job.failedReason };
};

// Removes a publisher job still waiting, cancels it once running. A finished
// job is left alone.
export const cancelPublisherJob = async (
    ctx: Parameters<typeof cancelJob>[0],
    jobId: string,
) => {
    const job = await getOrCreateWorkerQueue(ctx.tenant, 1).getJob(jobId);
    if (!job) {
        return;
    }
    if (await job.isActive()) {
        // concurrency 1: the active publisher job is this one
        await cancelJob(ctx, PUBLISHER);
        return;
    }
    if ((await job.isWaiting()) || (await job.isDelayed())) {
        await job.remove();
    }
};

export const JOBS_STILL_RUNNING = 'jobs_still_running';

// Cancels the waiting and running jobs of the tenant, and waits for the
// running one to stop writing: its writes would recreate what a clear drops.
// Throws when it does not stop in time.
export const stopJobs = async (ctx: AppContext, timeout = 30_000) => {
    const activeJob = await getActiveJob(ctx.tenant);
    if (activeJob?.data?.jobType === IMPORT) {
        // its job may not store its fusible yet: clearJobs would miss it
        await cancelImportJob(activeJob.id);
    }
    await clearJobs(ctx);
    if (!(await waitForRunningJob(ctx.tenant, timeout))) {
        throw new Error(JOBS_STILL_RUNNING);
    }
};
