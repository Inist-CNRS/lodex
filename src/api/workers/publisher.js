import publish from '../services/publish';
import publishFacets from '../controller/api/publishFacets';
import publishCharacteristics from '../services/publishCharacteristics';
import publishDocuments from '../services/publishDocuments';
import repositoryMiddleware from '../services/repositoryMiddleware';
import { cleanWaitingJobsOfType } from '.';

export const PUBLISHER = 'publisher';
const listeners = [];

export const processPublication = (job, done) => {
    cleanWaitingJobsOfType(PUBLISHER);
    startPublishing(job)
        .then(async () => {
            job.progress(100);
            const isFailed = await job.isFailed();
            notifyListeners({ isPublishing: false, success: !isFailed });
            done();
        })
        .catch(err => {
            handlePublishError(err);
            done(err);
        });
};

const startPublishing = async job => {
    notifyListeners({ isPublishing: true, success: false });
    const ctx = await prepareContext({ job });
    await publish(ctx);
};

const handlePublishError = async error => {
    notifyListeners({
        isPublishing: false,
        success: false,
        message: error.message,
    });
    const ctx = await prepareContext({});
    await ctx.publishedDataset.remove({});
    await ctx.publishedCharacteristic.remove({});
};

const prepareContext = async ctx => {
    ctx.tenant = ctx.job.data.tenant;
    await repositoryMiddleware(ctx, () => Promise.resolve());
    ctx.publishDocuments = publishDocuments;
    ctx.publishCharacteristics = publishCharacteristics;
    ctx.publishFacets = publishFacets;
    return ctx;
};

export const addPublisherListener = listener => listeners.push(listener);
const notifyListeners = payload =>
    listeners.forEach(listener => listener(payload));
