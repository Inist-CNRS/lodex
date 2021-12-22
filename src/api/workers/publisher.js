import Queue from 'bull';
import publish from '../services/publish';
import publishFacets from '../controller/api/publishFacets';
import publishCharacteristics from '../services/publishCharacteristics';
import publishDocuments from '../services/publishDocuments';
import repositoryMiddleware from '../services/repositoryMiddleware';

export const PUBLISH = 'publish';
export const PUBLISHER_QUEUE = 'publisher';
const listeners = [];
export const publisherQueue = new Queue(
    PUBLISHER_QUEUE,
    process.env.REDIS_URL,
    {
        defaultJobOptions: {
            removeOnComplete: 100,
            removeOnFail: 100,
            lifo: true,
        },
    },
);

publisherQueue.process(PUBLISH, (job, done) => {
    publisherQueue.clean(100, 'wait');
    startPublishing(job)
        .then(() => {
            job.progress(100);
            notifyListeners({ isPublishing: false, success: true });
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
