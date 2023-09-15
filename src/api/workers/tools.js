import { cleanWaitingJobsOfType, workerQueue } from '.';
import logger from '../services/logger';
import progress from '../services/progress';

export const jobLogger = {
    info: (job, message) => {
        if (!job) {
            return;
        }
        logger.info(message);
        job.log(message);
    },
    error: (job, message) => {
        if (!job) {
            return;
        }
        logger.error(message);
        job.log(message);
    },
};

export const getActiveJob = async tenant => {
    const activeJobs = await getActiveJobs(tenant);
    return activeJobs?.[0] || undefined;
};

export const getActiveJobs = async tenant => {
    const allActiveJobs = await workerQueue.getActive();
    const filteredActiveJobs = allActiveJobs.filter(
        job => job.data.tenant === tenant,
    );

    if (filteredActiveJobs.length === 0) {
        return undefined;
    }
    return filteredActiveJobs;
};

export const getWaitingJobs = async tenant => {
    const allWaitingJobs = await workerQueue.getWaiting();
    const filteredWaitingJobs = allWaitingJobs.filter(
        job => job.data.tenant === tenant,
    );

    if (filteredWaitingJobs.length === 0) {
        return undefined;
    }
    return filteredWaitingJobs;
};

export const cancelJob = async (ctx, jobType) => {
    const activeJob = await getActiveJob();
    if (activeJob?.data?.jobType === jobType) {
        if (jobType === 'publisher') {
            await cleanWaitingJobsOfType(activeJob.data.jobType);
        }
        activeJob.moveToFailed(new Error('cancelled'), true);
        progress.finish(ctx.tenant);
    }
};

export const dropJobs = async jobType => {
    const jobs = await workerQueue.getJobs();
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
