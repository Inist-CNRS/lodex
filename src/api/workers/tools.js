import { cleanWaitingJobsOfType, workerQueues } from '.';
import getLogger from '../services/logger';
import progress from '../services/progress';

export const jobLogger = {
    info: (job, message) => {
        if (!job) {
            return;
        }
        const logger = getLogger(job.data.tenant);
        logger.info(message);
        job.log(message);
    },
    error: (job, message) => {
        if (!job) {
            return;
        }
        const logger = getLogger(job.data.tenant);
        logger.error(message);
        job.log(message);
    },
};

export const getActiveJob = async tenant => {
    const activeJobs = await getActiveJobs(tenant);
    return activeJobs?.[0] || undefined;
};

export const getActiveJobs = async tenant => {
    const activeJobs = await workerQueues[tenant].getActive();

    if (activeJobs.length === 0) {
        return undefined;
    }
    return activeJobs;
};

export const getWaitingJobs = async tenant => {
    const waitingJobs = await workerQueues[tenant].getWaiting();

    if (waitingJobs.length === 0) {
        return undefined;
    }
    return waitingJobs;
};

export const cancelJob = async (ctx, jobType) => {
    const activeJob = await getActiveJob(ctx.tenant);
    if (activeJob?.data?.jobType === jobType) {
        if (jobType === 'publisher') {
            await cleanWaitingJobsOfType(ctx.tenant, activeJob.data.jobType);
        }
        activeJob.moveToFailed(new Error('cancelled'), true);
        progress.finish(ctx.tenant);
    }
};

export const dropJobs = async (tenant, jobType) => {
    const jobs = await workerQueues[tenant].getJobs();
    jobs.forEach(job => {
        if (!jobType || job.data.jobType === jobType) job.remove();
    });
};

export const clearJobs = async ctx => {
    const waitingJobs = await getWaitingJobs(ctx.tenant);
    const activeJobs = await getActiveJobs(ctx.tenant);

    waitingJobs?.forEach(waitingJob => waitingJob.remove());
    activeJobs?.forEach(activeJob =>
        activeJob.moveToFailed(new Error('cancelled'), true),
    );
    progress.finish(ctx.tenant);
};
