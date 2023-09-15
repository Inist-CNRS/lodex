import Queue from 'bull';
import { processPublication, PUBLISHER } from './publisher';
import { processEnrichment, ENRICHER } from './enricher';
import { processImport, IMPORT } from './import';

export const QUEUE_NAME = 'worker';

export class CancelWorkerError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CancelWorkerError';
    }
}
export const workerQueue = new Queue(QUEUE_NAME, process.env.REDIS_URL, {
    defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 10,
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

workerQueue.process('*', 1000, async (job, done) => {
    // if workerqueue already has an active job with the same job.data.tenant.
    // Set the job to the waiting state. If job is already waiting, do nothing.
    const activeJobs = await workerQueue.getActive();
    const waitingJobs = await workerQueue.getWaiting();
    const activeJob = activeJobs.find(
        activeJob =>
            activeJob.data.tenant === job.data.tenant &&
            activeJob.id !== job.id,
    );
    const waitingJob = waitingJobs.find(waitingJob => waitingJob.id === job.id);
    if (activeJob) {
        if (waitingJob) {
            return done();
        }
        await workerQueue.add(job.data.tenant, job.data, { delay: 5000 });
        return done();
    }

    if (job.data.jobType === PUBLISHER) {
        processPublication(job, done);
    }
    if (job.data.jobType === ENRICHER) {
        processEnrichment(job, done);
    }
    if (job.data.jobType === IMPORT) {
        processImport(job, done);
    }
});
