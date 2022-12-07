import repositoryMiddleware from '../services/repositoryMiddleware';
import { startImport, getLoader, getStreamFromUrl } from '../services/import';
import { clearChunks, mergeChunks } from '../services/fsHelpers';
import { saveParsedStream } from '../services/saveParsedStream';
import publishDocuments from '../services/publishDocuments';
import publishFacets from '../controller/api/publishFacets';
import saveStream from '../services/saveStream';

export const IMPORT = 'import';

export const processImport = (job, done) => {
    startJobImport(job)
        .then(() => {
            job.progress(100);
            done();
        })
        .catch(err => {
            handleImportError(err);
            done(err);
        });
};

const startJobImport = async job => {
    const ctx = await prepareContext({ job });
    await startImport(ctx);
};

const handleImportError = async () => {
    const ctx = await prepareContext({});
    await ctx.dataset.drop();
};

const prepareContext = async ctx => {
    await repositoryMiddleware(ctx, () => Promise.resolve());
    ctx.getLoader = getLoader;
    ctx.getStreamFromUrl = getStreamFromUrl;
    ctx.mergeChunks = mergeChunks;
    ctx.clearChunks = clearChunks;
    ctx.saveStream = saveStream;
    ctx.saveParsedStream = saveParsedStream;
    ctx.publishDocuments = publishDocuments;
    ctx.publishFacets = publishFacets;
    return ctx;
};
