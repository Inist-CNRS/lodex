import publish from '../services/publish';
import publishFacets from '../controller/api/publishFacets';
import publishCharacteristics from '../services/publishCharacteristics';
import publishDocuments from '../services/publishDocuments';
import repositoryMiddleware from '../services/repositoryMiddleware';
import { CancelWorkerError, cleanWaitingJobsOfType } from './index';
import clearPublished from '../services/clearPublished';

export const PUBLISHER = 'publisher';
const listeners: any = [];

export const processPublication = (job: any, done: any) => {
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
        .catch((err: any) => {
            handlePublishError(job, err);
            done(err);
        });
};

const startPublishing = async (job: any) => {
    notifyListeners(`${job.data.tenant}-publisher`, {
        isPublishing: true,
        success: false,
    });
    const ctx = await prepareContext({ job });
    await publish(ctx);
};

const handlePublishError = async (job: any, error: any) => {
    const ctx = await prepareContext({ job });
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    await clearPublished(ctx);
    // very useful for identifying the origin of production errors.
    console.warn('handlePublisherError', error);
    notifyListeners(`${job.data.tenant}-publisher`, {
        isPublishing: false,
        success: false,
        message:
            error instanceof CancelWorkerError
                ? 'cancelled_publish'
                : error.message,
    });
};

const prepareContext = async (ctx: any) => {
    ctx.tenant = ctx.job.data.tenant;
    await repositoryMiddleware(ctx, () => Promise.resolve());
    ctx.publishDocuments = publishDocuments;
    ctx.publishCharacteristics = publishCharacteristics;
    ctx.publishFacets = publishFacets;
    return ctx;
};

export const addPublisherListener = (listener: any) => listeners.push(listener);
const notifyListeners = (room: any, payload: any) => {
    listeners.forEach((listener: any) => listener({ room, data: payload }));
};
