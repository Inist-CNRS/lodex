import { workerQueue } from '.';
import logger from '../services/logger';

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
