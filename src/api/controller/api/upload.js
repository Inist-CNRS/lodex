import Koa from 'koa';
import route from 'koa-route';
import asyncBusboy from 'async-busboy';
import config from 'config';
import koaBodyParser from 'koa-bodyparser';
import request from 'request';

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

export const getParser = parserName => {
    if (!loaders[parserName]) {
        throw new Error(`Unknow parser: ${parserName}`);
    }
    return loaders[parserName](jsonConfig.loader[parserName]);
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

export const prepareUpload = async (ctx, next) => {
    ctx.getParser = getParser;
    ctx.requestToStream = requestToStream(asyncBusboy);
    ctx.saveStream = saveStream(ctx.dataset.insertMany.bind(ctx.dataset));
    ctx.checkFileExists = checkFileExists;
    ctx.saveStreamInFile = saveStreamInFile;
    ctx.areFileChunksComplete = areFileChunksComplete;
    ctx.mergeChunks = mergeChunks;
    ctx.clearChunks = clearChunks;
    ctx.createReadStream = createReadStream;
    ctx.unlinkFile = unlinkFile;
    ctx.getStreamFromUrl = getStreamFromUrl;

    await next();
};

export const parseRequest = async (ctx, parserName, next) => {
    const { stream, fields } = await ctx.requestToStream(ctx.req);

    const {
        resumableChunkNumber,
        resumableIdentifier,
        resumableTotalChunks,
        resumableTotalSize,
        resumableCurrentChunkSize,
        resumableFilename,
    } = fields;

    const chunkNumber = parseInt(resumableChunkNumber, 10);
    ctx.resumable = {
        totalChunks: parseInt(resumableTotalChunks, 10),
        totalSize: parseInt(resumableTotalSize, 10),
        currentChunkSize: parseInt(resumableCurrentChunkSize, 10),
        filename: `${config.uploadDir}/${resumableIdentifier}`,
        extension: resumableFilename.match(/[^.]*$/).pop(),
        chunkname: `${config.uploadDir}/${resumableIdentifier}.${chunkNumber}`,
        stream,
    };
    await next();
};

export async function uploadChunkMiddleware(ctx, parserName, next) {
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

export async function uploadFileMiddleware(ctx, parserName) {
    const { filename, totalChunks, extension } = ctx.resumable;
    const mergedStream = await ctx.mergeChunks(filename, totalChunks);

    const parseStream = ctx.getParser(
        !parserName || parserName === 'automatic' ? extension : parserName,
    );
    const parsedStream = await parseStream(mergedStream);

    await ctx.saveStream(parsedStream);
    await ctx.clearChunks(filename, totalChunks);
    await ctx.field.initializeModel();

    ctx.status = 200;
    ctx.body = {
        totalLines: await ctx.dataset.count(),
    };
}

export const checkChunkMiddleware = async ctx => {
    const {
        resumableChunkNumber,
        resumableIdentifier,
        resumableCurrentChunkSize,
    } = ctx.request.query;
    const chunkname = `${config.uploadDir}/${resumableIdentifier}.${
        resumableChunkNumber
    }`;
    const exists = await checkFileExists(chunkname, resumableCurrentChunkSize);
    ctx.status = exists ? 200 : 204;
};

export const uploadUrl = async ctx => {
    const { url, parserName } = ctx.request.body;
    const [extension] = url.match(/[^.]*$/);

    const parseStream = ctx.getParser(
        !parserName || parserName === 'automatic' ? extension : parserName,
    );

    await ctx.dataset.remove({});

    const stream = ctx.getStreamFromUrl(url);
    const parsedStream = await parseStream(stream);

    await ctx.saveStream(parsedStream);

    ctx.status = 200;
    ctx.body = {
        totalLines: await ctx.dataset.count(),
    };
};

const app = new Koa();

app.use(prepareUpload);

app.use(koaBodyParser());
app.use(route.post('/url', uploadUrl));

app.use(route.post('/:parserName', parseRequest));
app.use(route.post('/:parserName', uploadChunkMiddleware));
app.use(route.post('/:parserName', uploadFileMiddleware));

app.use(route.get('/:parserName', checkChunkMiddleware));

app.use(route.del('/clear', clearUpload));

export default app;
