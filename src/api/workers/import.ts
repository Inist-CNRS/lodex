import repositoryMiddleware from '../services/repositoryMiddleware';
import {
    startImport,
    getLoader,
    getStreamFromUrl,
    getCustomLoader,
    getStreamFromText,
} from '../services/import';
import { clearChunks, mergeChunks } from '../services/fsHelpers';
import { saveParsedStream } from '../services/saveParsedStream';
import publishDocuments from '../services/publishDocuments';
import publishFacets from '../controller/api/publishFacets';
import saveStream from '../services/saveStream';
import { CancelWorkerError, cleanWaitingJobsOfType } from '.';

export const IMPORT = 'import';
const listeners: any = [];

function getEzsMessageError(string: any) {
    if (string.includes('Line')) {
        return string.substring(0, string.indexOf('Line'));
    } else if (string.includes('<SyntaxError')) {
        return string.substring(0, string.indexOf('<SyntaxError'));
    } else {
        return string;
    }
}

export const processImport = (job: any, done: any) => {
    cleanWaitingJobsOfType(job.data.tenant, IMPORT);
    startJobImport(job)
        .then(async () => {
            job.progress(100);
            const isFailed = await job.isFailed();
            notifyListeners(`${job.data.tenant}-import`, {
                isImporting: false,
                success: !isFailed,
            });
            done();
        })
        .catch((err: any) => {
            handleImportError(job, err);
            done(err);
        });
};

const startJobImport = async (job: any) => {
    notifyListeners(`${job.data.tenant}-import`, {
        isImporting: true,
        success: false,
    });
    const ctx = await prepareContext({ job });
    await startImport(ctx);
};

const handleImportError = async (job: any, err: any) => {
    const ctx = await prepareContext({ job });
    if (err instanceof CancelWorkerError) {
        await ctx.dataset.drop();
    }
    // very useful for identifying the origin of production errors.
    console.warn('handleImportError', err);
    notifyListeners(`${job.data.tenant}-import`, {
        isImporting: false,
        success: false,
        message:
            err instanceof CancelWorkerError
                ? 'cancelled_import'
                : getEzsMessageError(err.message), // Ezs return all stack trace, we only want the message part. So we split on 'Line'
    });
};

const prepareContext = async (ctx: any) => {
    ctx.tenant = ctx.job.data.tenant;
    await repositoryMiddleware(ctx, () => Promise.resolve());
    ctx.getLoader = getLoader;
    ctx.getCustomLoader = getCustomLoader;
    ctx.getStreamFromUrl = getStreamFromUrl;
    ctx.getStreamFromText = getStreamFromText;
    ctx.mergeChunks = mergeChunks;
    ctx.clearChunks = clearChunks;
    ctx.saveStream = saveStream;
    ctx.saveParsedStream = saveParsedStream;
    ctx.publishDocuments = publishDocuments;
    ctx.publishFacets = publishFacets;
    return ctx;
};

export const addImportListener = (listener: any) => listeners.push(listener);

export const notifyListeners = (room: any, payload: any) => {
    listeners.forEach((listener: any) => listener({ room, data: payload }));
};
