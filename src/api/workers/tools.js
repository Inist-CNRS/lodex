import { cleanWaitingJobsOfType, workerQueue } from '.';
import clearPublished from '../services/clearPublished';
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
    const activeJobs = await workerQueue.getActive();
    if (activeJobs.length === 0) {
        return undefined;
    }
    return activeJobs[0];
};

export const cancelJob = async (ctx, jobType) => {
    const activeJob = await getActiveJob();
    if (activeJob?.data?.jobType === jobType) {
        await cleanWaitingJobsOfType(activeJob.data.jobType);
        activeJob.moveToFailed(new Error('cancelled'), true);
        clearPublished(ctx);
        progress.finish();
    }
};
