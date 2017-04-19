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

    const {
        resumableChunkNumber,
        resumableIdentifier,
        resumableTotalChunks,
        resumableTotalSize,
        resumableCurrentChunkSize,
    } = fields;

    const chunkNumber = parseInt(resumableChunkNumber, 10);
    ctx.resumable = {
        totalChunks: parseInt(resumableTotalChunks, 10),
        totalSize: parseInt(resumableTotalSize, 10),
        currentChunkSize: parseInt(resumableCurrentChunkSize, 10),
        filename: `${config.uploadDir}/${resumableIdentifier}`,
        chunkname: `${config.uploadDir}/${resumableIdentifier}.${chunkNumber}`,
        stream,
    };

    await next();
};

export async function uploadChunkMiddleware(ctx, type, next) {
    try {
        const {
            chunkname,
            currentChunkSize,
            stream,
            filename,
            totalChunks,
            totalSize,
        } = ctx.resumable;

        if (!await ctx.checkFileExists(chunkname, currentChunkSize)) {
            await ctx.saveStreamInFile(stream, chunkname);
        }

        if (await ctx.areFileChunksComplete(filename, totalChunks, totalSize)) {
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
    const {
        filename,
        totalChunks,
    } = ctx.resumable;
    await ctx.mergeChunks(filename, totalChunks);
    await ctx.clearChunks(filename, totalChunks);
    const fileStream = ctx.createReadStream(filename);

    const parseStream = ctx.getParser(type);
    const parsedStream = await parseStream(fileStream);

    await ctx.saveStream(parsedStream, ctx.dataset.insertMany.bind(ctx.dataset));
    await ctx.unlinkFile(filename);
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
