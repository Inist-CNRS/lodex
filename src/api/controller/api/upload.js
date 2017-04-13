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

export async function uploadChunkMiddleware(ctx, type) {
    try {
        const { stream, fields } = await ctx.requestToStream(ctx.req);

        const {
            resumableChunkNumber,
            resumableIdentifier,
            resumableTotalChunks,
            resumableTotalSize,
            resumableCurrentChunkSize,
        } = fields;

        const chunkNumber = parseInt(resumableChunkNumber, 10);
        const totalChunks = parseInt(resumableTotalChunks, 10);
        const totalSize = parseInt(resumableTotalSize, 10);
        const currentChunkSize = parseInt(resumableCurrentChunkSize, 10);

        const filename = `${config.uploadDir}/${resumableIdentifier}`;
        const chunkname = `${filename}.${chunkNumber}`;

        if (await checkFileExists(chunkname, currentChunkSize)) {
            ctx.status = 200;
            return;
        }

        await saveStreamInFile(stream, chunkname);

        if (await areFileChunksComplete(filename, totalChunks, totalSize)) {
            await mergeChunks(filename, totalChunks);
            await clearChunks(filename, totalChunks);
            const fileStream = fs.createReadStream(filename);

            const parseStream = ctx.getParser(type);
            const parsedStream = await parseStream(fileStream);

            await ctx.saveStream(parsedStream, ctx.dataset.insertMany.bind(ctx.dataset));
            await unlinkFile(filename);
            await ctx.field.initializeModel();

            ctx.status = 200;
            ctx.body = {
                totalLines: await ctx.dataset.count(),
            };
        }

        ctx.status = 200;
    } catch (error) {
        ctx.status = 500;
        ctx.body = error.message;
    }
}

export const prepareUpload = async (ctx, next) => {
    ctx.getParser = getParser;
    ctx.requestToStream = requestToStream(asyncBusboy);
    ctx.saveStream = saveStream;

    await next();
};

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

app.use(route.post('/:type', uploadChunkMiddleware));
app.use(route.get('/:type', checkChunkMiddleware));
app.use(route.del('/clear', clearUpload));

export default app;
