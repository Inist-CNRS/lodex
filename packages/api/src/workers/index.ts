import Queue from 'bull';
import bullBoard from '../bullBoard';
import { ENRICHER, processEnrichment, RETRY_ENRICHER } from './enricher';
import { IMPORT, processImport } from './import';
import { PRECOMPUTER, processPrecomputed } from './precomputer';
import { processPublication, PUBLISHER } from './publisher';

export const QUEUE_NAME = 'worker';

export class CancelWorkerError extends Error {
    name: any;
    errorCount?: number;
    constructor(message: any) {
        super(message);
        this.name = 'CancelWorkerError';
    }
}

export const workerQueues: any = {};

export const getOrCreateWorkerQueue = (
    queueName: any,
    concurrency: any,
): Queue.Queue => {
    if (workerQueues[queueName]) {
        return workerQueues[queueName];
    }

    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    const workerQueue = new Queue(queueName, process.env.REDIS_URL, {
        defaultJobOptions: {
            removeOnComplete: 10,
            removeOnFail: 10,
            lifo: true,
        },
    });

    workerQueue.process('*', concurrency, (job: any, done: any) => {
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

    bullBoard.addDashboardQueue(queueName, workerQueue);

    return workerQueue;
};

export const deleteWorkerQueue = async (queueName: any) => {
    if (!workerQueues[queueName]) {
        return;
    }
    const workerQueue = workerQueues[queueName];
    await workerQueue.close();
    delete workerQueues[queueName];
};

export const cleanWaitingJobsOfType = (queueName: any, jobType: any) => {
    const workerQueue = getOrCreateWorkerQueue(queueName, 1);
    workerQueue.getWaiting().then((jobs: any) => {
        jobs.filter((job: any) => job.data.jobType === jobType).forEach(
            (waitingJob: any) => waitingJob.remove(),
        );
    });
};

export const closeAllWorkerQueues = async () => {
    await Promise.all(
        Object.keys(workerQueues).map((queueName: any) =>
            workerQueues[queueName].close(),
        ),
    );
};
