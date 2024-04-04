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
    cleanWaitingJobsOfType(job.data.tenant, PUBLISHER);
    startPublishing(job)
        .then(async () => {
            job.progress(100);
            const isFailed = await job.isFailed();
            notifyListeners(`${job.data.tenant}-publisher`, {
                isPublishing: false,
                success: !isFailed,
            });
            done();
        })
        .catch((err) => {
            handlePublishError(job, err);
            done(err);
        });
};

const startPublishing = async (job) => {
    notifyListeners(`${job.data.tenant}-publisher`, {
        isPublishing: true,
        success: false,
    });
    const ctx = await prepareContext({ job });
    await publish(ctx);
};

const handlePublishError = async (job, error) => {
    const ctx = await prepareContext({ job });
    await clearPublished(ctx);
    notifyListeners(`${job.data.tenant}-publisher`, {
        isPublishing: false,
        success: false,
        message:
            error instanceof CancelWorkerError
                ? 'cancelled_publish'
                : error.message,
    });
};

const prepareContext = async (ctx) => {
    ctx.tenant = ctx.job.data.tenant;
    await repositoryMiddleware(ctx, () => Promise.resolve());
    ctx.publishDocuments = publishDocuments;
    ctx.publishCharacteristics = publishCharacteristics;
    ctx.publishFacets = publishFacets;
    return ctx;
};

export const addPublisherListener = (listener) => listeners.push(listener);
const notifyListeners = (room, payload) => {
    listeners.forEach((listener) => listener({ room, data: payload }));
};
