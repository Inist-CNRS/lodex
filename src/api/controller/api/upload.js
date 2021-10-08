import Koa from 'koa';
import route from 'koa-route';
import asyncBusboy from 'async-busboy';
import config from 'config';
import koaBodyParser from 'koa-bodyparser';
import request from 'request';
import ezs from '@ezs/core';

import progress from '../../services/progress';
import {
    PENDING,
    UPLOADING_DATASET,
    SAVING_DATASET,
} from '../../../common/progressStatus';
import Script from '../../services/script';
import saveStream from '../../services/saveStream';
import publishDocuments from '../../services/publishDocuments';
import {
    unlinkFile,
    saveStreamInFile,
    checkFileExists,
    mergeChunks,
    clearChunks,
    getUploadedFileSize,
    createReadStream,
} from '../../services/fsHelpers';
import saveParsedStream from '../../services/saveParsedStream';
import publishFacets from './publishFacets';
import initDatasetUri from '../../services/initDatasetUri';

const loaders = new Script('loaders', '../app/custom/loaders');
const log = e => global.console.error('Error in pipeline.', e);

export const getLoader = async loaderName => {
    const currentLoader = await loaders.get(loaderName);
    if (!currentLoader) {
        throw new Error(`Unknown loader: ${loaderName}`);
    }

    const [, , , script] = currentLoader;

    // ezs is safe : errors do not break the pipeline
    return stream =>
        stream.pipe(ezs('delegate', { script })).pipe(ezs.catch(e => log(e)));
};

export const requestToStream = asyncBusboyImpl => async req => {
    const { files, fields } = await asyncBusboyImpl(req);

    return { stream: files[0], fields };
};

export const clearUpload = async ctx => {
    await ctx.dataset.remove({});
    ctx.body = true;
};

export const getStreamFromUrl = url => request.get(url);

export const uploadFile = ctx => async loaderName => {
    progress.start(SAVING_DATASET, 0);
    const { filename, totalChunks, extension } = ctx.resumable;
    const mergedStream = ctx.mergeChunks(filename, totalChunks);
    const parseStream = await ctx.getLoader(
        !loaderName || loaderName === 'automatic' ? extension : loaderName,
    );

    const parsedStream = parseStream(mergedStream);
    try {
        await ctx.saveParsedStream(parsedStream, ctx.initDatasetUri);
        progress.finish();
    } catch (error) {
        progress.throw(error);
    }

    await ctx.clearChunks(filename, totalChunks);
};

export const prepareUpload = async (ctx, next) => {
    ctx.getLoader = getLoader;
    ctx.requestToStream = requestToStream(asyncBusboy);
    ctx.initDatasetUri = initDatasetUri(ctx);
    ctx.saveStream = saveStream(ctx.dataset.bulkUpsertByUri);
    ctx.checkFileExists = checkFileExists;
    ctx.saveStreamInFile = saveStreamInFile;
    ctx.getUploadedFileSize = getUploadedFileSize;
    ctx.mergeChunks = mergeChunks;
    ctx.clearChunks = clearChunks;
    ctx.createReadStream = createReadStream;
    ctx.unlinkFile = unlinkFile;
    ctx.getStreamFromUrl = getStreamFromUrl;
    ctx.publishDocuments = publishDocuments;
    ctx.publishFacets = publishFacets;
    ctx.saveParsedStream = saveParsedStream(ctx);
    ctx.uploadFile = uploadFile(ctx);

    try {
        await next();
    } catch (error) {
        progress.throw(error);
        ctx.status = 500;
        ctx.body = error.message;
    }
};

export const parseRequest = async (ctx, _, next) => {
    const { stream, fields } = await ctx.requestToStream(ctx.req);

    const {
        resumableChunkNumber,
        resumableIdentifier,
        resumableTotalChunks,
        resumableTotalSize,
        resumableCurrentChunkSize,
        resumableFilename = '',
    } = fields;
    const [extension] = resumableFilename.match(/[^.]*$/);
    const chunkNumber = parseInt(resumableChunkNumber, 10);

    ctx.resumable = {
        totalChunks: parseInt(resumableTotalChunks, 10),
        totalSize: parseInt(resumableTotalSize, 10),
        currentChunkSize: parseInt(resumableCurrentChunkSize, 10),
        filename: `${config.uploadDir}/${resumableIdentifier}`,
        extension,
        chunkname: `${config.uploadDir}/${resumableIdentifier}.${chunkNumber}`,
        stream,
    };
    await next();
};

export async function uploadChunkMiddleware(ctx, loaderName) {
    const {
        chunkname,
        currentChunkSize,
        stream,
        filename,
        totalChunks,
        totalSize,
    } = ctx.resumable;

    if (progress.getProgress().status === PENDING) {
        progress.start(UPLOADING_DATASET, 100, '%');
    }
    if (!(await ctx.checkFileExists(chunkname, currentChunkSize))) {
        await ctx.saveStreamInFile(stream, chunkname);
    }

    const uploadedFileSize = await ctx.getUploadedFileSize(
        filename,
        totalChunks,
    );

    const progression = Math.round((uploadedFileSize * 100) / totalSize);

    progress.setProgress(progression === 100 ? 99 : progression);

    if (uploadedFileSize >= totalSize) {
        ctx.uploadFile(loaderName);
    }

    ctx.status = 200;
}

export const uploadUrl = async ctx => {
    const { url, loaderName } = ctx.request.body;
    const [extension] = url.match(/[^.]*$/);

    const parseStream = await ctx.getLoader(
        !loaderName || loaderName === 'automatic' ? extension : loaderName,
    );

    const stream = ctx.getStreamFromUrl(url);
    const parsedStream = await parseStream(stream);

    ctx.body = {
        totalLines: await ctx.saveParsedStream(
            parsedStream,
            ctx.initDatasetUri,
        ),
    };

    ctx.status = 200;
};

export const checkChunkMiddleware = async ctx => {
    const {
        resumableChunkNumber,
        resumableIdentifier,
        resumableCurrentChunkSize,
    } = ctx.request.query;
    const chunkname = `${config.uploadDir}/${resumableIdentifier}.${resumableChunkNumber}`;
    const exists = await checkFileExists(chunkname, resumableCurrentChunkSize);
    ctx.status = exists ? 200 : 204;
};

const app = new Koa();

app.use(prepareUpload);

app.use(koaBodyParser());
app.use(route.post('/url', uploadUrl));

app.use(route.post('/:loaderName', parseRequest));
app.use(route.post('/:loaderName', uploadChunkMiddleware));
app.use(route.get('/:loaderName', checkChunkMiddleware));

app.use(route.del('/clear', clearUpload));

export default app;
