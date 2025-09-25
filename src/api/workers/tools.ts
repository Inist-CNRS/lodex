import { cleanWaitingJobsOfType, workerQueues, CancelWorkerError } from '.';
import { disableFusible } from '@ezs/core/fusible';

// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { ERROR } from '../../common/progressStatus';
import getLogger from '../services/logger';
import progress from '../services/progress';
import { notifyListeners } from './import';
import { handleEnrichmentError } from './enricher';

export const jobLogger = {
    info: (job: any, message: any) => {
        if (!job) {
            return;
        }
        const logger = getLogger(job.data.tenant);
        logger.info(message);
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

export const getActiveJob = async (tenant: any) => {
    const activeJobs = await getActiveJobs(tenant);
    return activeJobs?.[0] || undefined;
};

export const getActiveJobs = async (tenant: any) => {
    const activeJobs = (await workerQueues[tenant]?.getActive()) || null;

    if (activeJobs.length === 0) {
        return undefined;
    }
    return activeJobs;
};

export const getcompletedJobs = async (tenant: any) => {
    const completedJobs = (await workerQueues[tenant]?.getCompleted()) || null;

    if (completedJobs.length === 0) {
        return undefined;
    }
    return completedJobs;
};

export const getWaitingJobs = async (tenant: any) => {
    const waitingJobs = await workerQueues[tenant].getWaiting();

    if (waitingJobs.length === 0) {
        return undefined;
    }
    return waitingJobs;
};

export const cancelJob = async (ctx: any, jobType: any, subLabel = null) => {
    const activeJob = await getActiveJob(ctx.tenant);
    if (activeJob?.data?.fusible) {
        await disableFusible(activeJob.data.fusible);
    }
    if (activeJob?.data?.jobType === jobType) {
        if (jobType === 'publisher') {
            await cleanWaitingJobsOfType(ctx.tenant, activeJob.data.jobType);
        }

        activeJob.moveToFailed(new Error('cancelled'), true);
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
        await ctx.precomputed.updateStatus(precomputedID, ERROR);
        progress.finish(ctx.tenant);
        notifyListeners(`${jobToFail?.data?.tenant}-precomputer`, {
            isPrecomputing: false,
            success: false,
        });
        return;
    }
};

export const dropJobs = async (tenant: any, jobType: any) => {
    const jobs = await workerQueues[tenant].getJobs();
    jobs.forEach((job: any) => {
        if (!jobType || job?.data?.jobType === jobType) job.remove();
    });
};

export const clearJobs = async (ctx: any) => {
    const waitingJobs = await getWaitingJobs(ctx.tenant);
    if (waitingJobs) {
        for (const waitingJob of waitingJobs) {
            waitingJob.remove();
            if (waitingJob.name === 'enricher') {
                await handleEnrichmentError(waitingJob, CancelWorkerError);
            }
        }
    }
    const activeJobs = await getActiveJobs(ctx.tenant);
    if (activeJobs) {
        for (const activeJob of activeJobs) {
            if (activeJob.name === 'enricher') {
                await handleEnrichmentError(activeJob, CancelWorkerError);
            }
            activeJob.moveToFailed(new Error('cancelled'), true);
        }
    }
    progress.finish(ctx.tenant);
};
