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
