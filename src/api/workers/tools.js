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

export const getActiveJob = async () => {
    const activeJobs = await getActiveJobs();
    return activeJobs?.[0] || undefined;
};

export const getActiveJobs = async () => {
    const activeJobs = await workerQueue.getActive();
    if (activeJobs.length === 0) {
        return undefined;
    }
    return activeJobs;
};

export const getWaitingJobs = async () => {
    const waitingJobs = await workerQueue.getWaiting();
    if (waitingJobs.length === 0) {
        return undefined;
    }
    return waitingJobs;
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
    const waitingJobs = await getWaitingJobs();
    const activeJobs = await getActiveJobs();
    waitingJobs?.forEach(waitingJob => waitingJob.remove());
    activeJobs?.forEach(activeJob =>
        activeJob.moveToFailed(new Error('cancelled'), true),
    );
    progress.finish(ctx.tenant);
};
