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

function getEzsMessageError(string) {
    if (string.includes('Line')) {
        return string.substring(0, string.indexOf('Line'));
    } else if (string.includes('<SyntaxError')) {
        return string.substring(0, string.indexOf('<SyntaxError'));
    } else {
        return string;
    }
}

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
    const ctx = await prepareContext({ job });
    if (err instanceof CancelWorkerError) {
        await ctx.dataset.drop();
    }
    notifyListeners({
        isImporting: false,
        success: false,
        message:
            err instanceof CancelWorkerError
                ? 'cancelled_import'
                : getEzsMessageError(err.message), // Ezs return all stack trace, we only want the message part. So we split on 'Line'
    });
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
