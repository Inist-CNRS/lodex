import Queue from 'bull';
import config from 'config';
import bullBoard from '../bullBoard';
import getLogger from '../services/logger';
import { ENRICHER, processEnrichment, RETRY_ENRICHER } from './enricher';
import { IMPORT, processImport } from './import';
import { PRECOMPUTER, processPrecomputed } from './precomputer';
import { processPublication, PUBLISHER } from './publisher';
import { sweepTenants } from '../services/siteGeneration/sweep';

export const QUEUE_NAME = 'worker';

const STEP_JOB_TYPES = [ENRICHER, RETRY_ENRICHER, PRECOMPUTER];

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

    const workerQueue = new Queue(queueName, config.get('redis.url'), {
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

    // Bull is silent otherwise: a job whose lock expired ("Missing lock") or
    // that is run again after stalling must leave a trace
    const logger = getLogger(queueName);
    workerQueue.on('error', (error: Error) => {
        logger.error(`Worker queue error: ${error?.message}`, error);
    });
    workerQueue.on('stalled', (job: Queue.Job) => {
        logger.warn(
            `Worker job stalled and will run again: ${job?.id} (${job?.data?.jobType})`,
        );
    });

    // An enrichment or precomputation ended (by hand or as a step of a site
    // generation): advance the tenant's generation now rather than on the
    // next periodic sweep
    const advanceSiteGeneration = (job: Queue.Job) => {
        if (STEP_JOB_TYPES.includes(job?.data?.jobType)) {
            sweepTenants([job.data.tenant]);
        }
    };
    workerQueue.on('completed', advanceSiteGeneration);
    workerQueue.on('failed', advanceSiteGeneration);

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
