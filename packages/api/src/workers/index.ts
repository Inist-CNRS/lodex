import Queue from 'bull';
import config from 'config';
import bullBoard from '../bullBoard';
import getLogger from '../services/logger';
import { ENRICHER, processEnrichment, RETRY_ENRICHER } from './enricher';
import { IMPORT, processImport } from './import';
import { MODEL_IMPORTER, processModelImport } from './modelImport';
import { PRECOMPUTER, processPrecomputed } from './precomputer';
import { processPublication, PUBLISHER } from './publisher';
import { sweepTenants } from '../services/siteGeneration/sweep';

export const QUEUE_NAME = 'worker';

// the jobs a site generation waits for: the publisher job ends one with
// autoPublish, which must not stay on screen until the next periodic sweep
const STEP_JOB_TYPES = [ENRICHER, RETRY_ENRICHER, PRECOMPUTER, PUBLISHER];

export class CancelWorkerError extends Error {
    name: any;
    errorCount?: number;
    constructor(message: any) {
        super(message);
        this.name = 'CancelWorkerError';
    }
}

export const workerQueues: any = {};

// the end of the job each queue (a tenant) runs, resolved once the job calls
// done(): its last write is then behind it, even once cancelled (a cancelled
// job is moved to failed while its pipeline still runs)
// ponytail: in-process, the worker runs in the API process (a single pm2
// instance) with a concurrency of 1; otherwise, wait on Redis instead
const runningJobs = new Map<string, Promise<void>>();

// true once the running job of the queue, if any, called done(); false after
// `timeout`
export const waitForRunningJob = async (queueName: string, timeout: number) => {
    const running = runningJobs.get(queueName);
    if (!running) {
        return true;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timedOut = new Promise<boolean>((resolve) => {
        timer = setTimeout(() => resolve(false), timeout);
    });
    const ended = await Promise.race([running.then(() => true), timedOut]);
    clearTimeout(timer);
    return ended;
};

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

    workerQueue.process('*', concurrency, (job: any, jobDone: any) => {
        let end = () => {};
        const running = new Promise<void>((resolve) => {
            end = resolve;
        });
        runningJobs.set(queueName, running);
        const done = (...args: unknown[]) => {
            if (runningJobs.get(queueName) === running) {
                runningJobs.delete(queueName);
            }
            end();
            jobDone(...args);
        };
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
        if (job.data.jobType === MODEL_IMPORTER) {
            processModelImport(job, done);
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

    // An enrichment, precomputation or publication ended (by hand or as a
    // step of a site generation): advance the tenant's generation now rather than on the
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
    return (
        workerQueue
            .getWaiting()
            // a job picked up meanwhile cannot be removed: its cancel stops it
            .then((jobs: any) =>
                Promise.allSettled(
                    jobs
                        .filter((job: any) => job.data.jobType === jobType)
                        .map((waitingJob: any) => waitingJob.remove()),
                ),
            )
    );
};

export const closeAllWorkerQueues = async () => {
    await Promise.all(
        Object.keys(workerQueues).map((queueName: any) =>
            workerQueues[queueName].close(),
        ),
    );
};
