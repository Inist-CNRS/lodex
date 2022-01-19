import Queue from 'bull';
import publish from '../services/publish';
import publishFacets from '../controller/api/publishFacets';
import publishCharacteristics from '../services/publishCharacteristics';
import publishDocuments from '../services/publishDocuments';
import repositoryMiddleware from '../services/repositoryMiddleware';

export const PUBLISH = 'publisher';
export const QUEUE_NAME = 'worker';
const listeners = [];
export const workerQueue = new Queue(QUEUE_NAME, process.env.REDIS_URL, {
    limiter: {
        max: 1,
        duration: 1000,
    },
    defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 100,
        lifo: true,
    },
});

workerQueue.process(PUBLISH, (job, done) => {
    workerQueue.getWaiting().then(jobs => {
        jobs.filter(job => job.name === PUBLISH).forEach(waitingJob =>
            waitingJob.remove(),
        );
    });
    // publisherQueue.clean(100, 'wait');
    startPublishing(job)
        .then(async () => {
            job.progress(100);
            const isFailed = await job.isFailed();
            notifyListeners({ isPublishing: false, success: !isFailed });
            done();
        })
        .catch(err => {
            handlePublishError();
            done(err);
        });
});

const startPublishing = async job => {
    notifyListeners({ isPublishing: true, success: false });
    const ctx = await prepareContext({ job });
    await publish(ctx);
};

const handlePublishError = async () => {
    notifyListeners({ isPublishing: false, success: false });
    const ctx = await prepareContext({});
    await ctx.publishedDataset.remove({});
    await ctx.publishedCharacteristic.remove({});
};

const prepareContext = async ctx => {
    await repositoryMiddleware(ctx, () => Promise.resolve());
    ctx.publishDocuments = publishDocuments;
    ctx.publishCharacteristics = publishCharacteristics;
    ctx.publishFacets = publishFacets;
    return ctx;
};

export const addPublisherListener = listener => listeners.push(listener);
const notifyListeners = payload =>
    listeners.forEach(listener => listener(payload));
