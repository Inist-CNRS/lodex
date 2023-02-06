import publish from '../services/publish';
import publishFacets from '../controller/api/publishFacets';
import publishCharacteristics from '../services/publishCharacteristics';
import publishDocuments from '../services/publishDocuments';
import repositoryMiddleware from '../services/repositoryMiddleware';
import { CancelWorkerError, cleanWaitingJobsOfType } from '.';
import clearPublished from '../services/clearPublished';

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
    const ctx = await prepareContext({});
    await clearPublished(ctx);
    notifyListeners({
        isPublishing: false,
        success: false,
        message:
            error instanceof CancelWorkerError
                ? 'cancelled_publish'
                : error.message,
    });
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
