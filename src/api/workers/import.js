import repositoryMiddleware from '../services/repositoryMiddleware';
import {
    startImport,
    getLoader,
    getStreamFromUrl,
    getCustomLoader,
} from '../services/import';
import { clearChunks, mergeChunks } from '../services/fsHelpers';
import { saveParsedStream } from '../services/saveParsedStream';
import publishDocuments from '../services/publishDocuments';
import publishFacets from '../controller/api/publishFacets';
import saveStream from '../services/saveStream';
import { CancelWorkerError, cleanWaitingJobsOfType } from '.';

export const IMPORT = 'import';
const listeners = [];

export const processImport = (job, done) => {
    cleanWaitingJobsOfType(IMPORT);
    startJobImport(job)
        .then(async () => {
            job.progress(100);
            const isFailed = await job.isFailed();
            notifyListeners({ isImporting: false, success: !isFailed });
            done();
        })
        .catch(err => {
            handleImportError(job, err);
            done(err);
        });
};

const startJobImport = async job => {
    notifyListeners({ isImporting: true, success: false });
    const ctx = await prepareContext({ job });
    await startImport(ctx);
};

const handleImportError = async (job, err) => {
    notifyListeners({
        isImporting: false,
        success: false,
        message: err.message,
    });
    const ctx = await prepareContext({ job });
    if (err instanceof CancelWorkerError) {
        await ctx.dataset.drop();
    }
};

const prepareContext = async ctx => {
    await repositoryMiddleware(ctx, () => Promise.resolve());
    ctx.getLoader = getLoader;
    ctx.getCustomLoader = getCustomLoader;
    ctx.getStreamFromUrl = getStreamFromUrl;
    ctx.mergeChunks = mergeChunks;
    ctx.clearChunks = clearChunks;
    ctx.saveStream = saveStream;
    ctx.saveParsedStream = saveParsedStream;
    ctx.publishDocuments = publishDocuments;
    ctx.publishFacets = publishFacets;
    return ctx;
};

export const addImportListener = listener => listeners.push(listener);
const notifyListeners = payload =>
    listeners.forEach(listener => listener(payload));
