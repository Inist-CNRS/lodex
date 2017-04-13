import Koa from 'koa';
import route from 'koa-route';
import asyncBusboy from 'async-busboy';
import config from 'config';
import fs from 'fs';

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
        if (await checkFileExists(ctx.chunkname, ctx.currentChunkSize)) {
            ctx.status = 200;
            return;
        }

        await saveStreamInFile(ctx.stream, ctx.chunkname);

        if (await areFileChunksComplete(ctx.filename, ctx.totalChunks, ctx.totalSize)) {
            await next(); // pass to uploadFile middleware
        }

        ctx.status = 200;
    } catch (error) {
        ctx.status = 500;
        ctx.body = error.message;
    }
}

export async function uploadFileMiddleware(ctx, type) {
    await mergeChunks(ctx.filename, ctx.totalChunks);
    await clearChunks(ctx.filename, ctx.totalChunks);
    const fileStream = fs.createReadStream(ctx.filename);

    const parseStream = ctx.getParser(type);
    const parsedStream = await parseStream(fileStream);

    await ctx.saveStream(parsedStream, ctx.dataset.insertMany.bind(ctx.dataset));
    await unlinkFile(ctx.filename);
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
