import Queue from 'bull';
import { processPublication, PUBLISHER } from './publisher';
import { processEnrichment, ENRICHER, RETRY_ENRICHER } from './enricher';
import { processPrecomputed, PRECOMPUTER } from './precomputer';
import { processImport, IMPORT } from './import';

export const QUEUE_NAME = 'worker';

export class CancelWorkerError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CancelWorkerError';
    }
}

export const workerQueues = {};

export const createWorkerQueue = (queueName, concurrency) => {
    if (workerQueues[queueName]) {
        return;
    }

    const workerQueue = new Queue(queueName, process.env.REDIS_URL, {
        defaultJobOptions: {
            removeOnComplete: 10,
            removeOnFail: 10,
            lifo: true,
        },
    });

    workerQueue.process('*', concurrency, (job, done) => {
        if (job.data.jobType === PUBLISHER) {
            processPublication(job, done);
        }
        if (job.data.jobType === RETRY_ENRICHER) {
            processEnrichment(job, true, done);
        }
        if (job.data.jobType === ENRICHER) {
            processEnrichment(job, false, done);
        }
        if (job.data.jobType === IMPORT) {
            processImport(job, done);
        }
        if (job.data.jobType === PRECOMPUTER) {
            processPrecomputed(job, done);
        }
    });

    workerQueues[queueName] = workerQueue;

    return workerQueue;
};

export const deleteWorkerQueue = async (queueName) => {
    const workerQueue = workerQueues[queueName];
    await workerQueue.close();
    delete workerQueues[queueName];
};

export const cleanWaitingJobsOfType = (queueName, jobType) => {
    const workerQueue = workerQueues[queueName];
    workerQueue.getWaiting().then((jobs) => {
        jobs.filter((job) => job.data.jobType === jobType).forEach(
            (waitingJob) => waitingJob.remove(),
        );
    });
};

export const closeAllWorkerQueues = async () => {
    await Promise.all(
        Object.keys(workerQueues).map((queueName) =>
            workerQueues[queueName].close(),
        ),
    );
};
