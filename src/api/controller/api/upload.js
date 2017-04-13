import Koa from 'koa';
import route from 'koa-route';
import asyncBusboy from 'async-busboy';
import config from 'config';

import jsonConfig from '../../../../config.json';
import loaders from '../../loaders';
import saveStream from '../../services/saveStream';
import {
    unlinkFile,
    saveStreamInFile,
    checkFileExists,
    mergeChunks,
    clearChunks,
    areFileChunksComplete,
    createReadStream,
} from '../../services/fsHelpers';

export const getParser = (type) => {
    if (!loaders[type]) {
        throw new Error(`Unsupported document type: ${type}`);
    }

    return loaders[type](jsonConfig.loader[type]);
};

export const requestToStream = asyncBusboyImpl => async (req) => {
    const {
        files,
        fields,
    } = await asyncBusboyImpl(req);

    return { stream: files[0], fields };
};

export const clearUpload = async (ctx) => {
    await ctx.dataset.remove({});
    ctx.body = true;
};

export const prepareUpload = async (ctx, next) => {
    ctx.getParser = getParser;
    ctx.requestToStream = requestToStream(asyncBusboy);
    ctx.saveStream = saveStream;
    ctx.checkFileExists = checkFileExists;
    ctx.saveStreamInFile = saveStreamInFile;
    ctx.areFileChunksComplete = areFileChunksComplete;
    ctx.mergeChunks = mergeChunks;
    ctx.clearChunks = clearChunks;
    ctx.createReadStream = createReadStream;
    ctx.unlinkFile = unlinkFile;

    await next();
};

export const parseRequest = async (ctx, type, next) => {
    const { stream, fields } = await ctx.requestToStream(ctx.req);
    ctx.stream = stream;

    const {
        resumableChunkNumber,
        resumableIdentifier,
        resumableTotalChunks,
        resumableTotalSize,
        resumableCurrentChunkSize,
    } = fields;

    const chunkNumber = parseInt(resumableChunkNumber, 10);
    ctx.totalChunks = parseInt(resumableTotalChunks, 10);
    ctx.totalSize = parseInt(resumableTotalSize, 10);
    ctx.currentChunkSize = parseInt(resumableCurrentChunkSize, 10);

    ctx.filename = `${config.uploadDir}/${resumableIdentifier}`;
    ctx.chunkname = `${ctx.filename}.${chunkNumber}`;

    await next();
};

export async function uploadChunkMiddleware(ctx, type, next) {
    try {
        if (!await ctx.checkFileExists(ctx.chunkname, ctx.currentChunkSize)) {
            await ctx.saveStreamInFile(ctx.stream, ctx.chunkname);
        }

        if (await ctx.areFileChunksComplete(ctx.filename, ctx.totalChunks, ctx.totalSize)) {
            await next();
            return;
        }

        ctx.status = 200;
    } catch (error) {
        ctx.status = 500;
        ctx.body = error.message;
    }
}

export async function uploadFileMiddleware(ctx, type) {
    await ctx.mergeChunks(ctx.filename, ctx.totalChunks);
    await ctx.clearChunks(ctx.filename, ctx.totalChunks);
    const fileStream = ctx.createReadStream(ctx.filename);

    const parseStream = ctx.getParser(type);
    const parsedStream = await parseStream(fileStream);

    await ctx.saveStream(parsedStream, ctx.dataset.insertMany.bind(ctx.dataset));
    await ctx.unlinkFile(ctx.filename);
    await ctx.field.initializeModel();

    ctx.status = 200;
    ctx.body = {
        totalLines: await ctx.dataset.count(),
    };
}

export const checkChunkMiddleware = async (ctx) => {
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

app.use(route.post('/:type', parseRequest));
app.use(route.post('/:type', uploadChunkMiddleware));
app.use(route.post('/:type', uploadFileMiddleware));

app.use(route.get('/:type', checkChunkMiddleware));

app.use(route.del('/clear', clearUpload));

export default app;
