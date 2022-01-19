import Queue from 'bull';
import { processPublication, PUBLISHER } from './publisher';
import { processEnrichment, ENRICHER } from './enricher';

export const QUEUE_NAME = 'worker';

export const workerQueue = new Queue(QUEUE_NAME, process.env.REDIS_URL, {
    defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 100,
        lifo: true,
    },
});

export const cleanWaitingJobsOfType = jobType => {
    workerQueue.getWaiting().then(jobs => {
        jobs.filter(job => job.data.jobType === jobType).forEach(waitingJob =>
            waitingJob.remove(),
        );
    });
};

workerQueue.process(1, (job, done) => {
    if (job.data.jobType === PUBLISHER) {
        processPublication(job, done);
    }
    if (job.data.jobType === ENRICHER) {
        processEnrichment(job, done);
    }
});
