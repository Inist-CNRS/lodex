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
import publishFacets from './publishFacets';
import saveParsedStream from '../../services/saveParsedStream';
import safePipe from '../../services/safePipe';

const loaders = new Script('loaders');

export const getParser = async parserName => {
    const currentLoader = await loaders.get(parserName);
    if (!currentLoader) {
        throw new Error(`Unknow parser: ${parserName}`);
    }

    const [, , , script] = currentLoader;

    return stream =>
        safePipe(stream, [
            ezs('delegate', { script }),
            ezs((data, feed) => {
                if (data instanceof Error) {
                    global.console.error('Error in pipeline.', data);
                    feed.end();
                } else {
                    feed.send(data);
                }
            }),
        ]);
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

export const uploadFile = ctx => async parserName => {
    progress.start(SAVING_DATASET, 0);
    const { filename, totalChunks, extension } = ctx.resumable;
    const mergedStream = ctx.mergeChunks(filename, totalChunks);

    const parseStream = await ctx.getParser(
        !parserName || parserName === 'automatic' ? extension : parserName,
    );

    const parsedStream = parseStream(mergedStream);

    try {
        await ctx.saveParsedStream(parsedStream);
    } catch (error) {
        progress.throw(error);
        return;
    }

    await ctx.clearChunks(filename, totalChunks);

    progress.finish();
};

export const prepareUpload = async (ctx, next) => {
    ctx.getParser = getParser;
    ctx.requestToStream = requestToStream(asyncBusboy);
    ctx.saveStream = saveStream(ctx.dataset.insertMany.bind(ctx.dataset));
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

export const parseRequest = async (ctx, parserName, next) => {
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

export async function uploadChunkMiddleware(ctx, parserName) {
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
        ctx.uploadFile(parserName);
    }

    ctx.status = 200;
}

export const uploadUrl = async ctx => {
    const { url, parserName } = ctx.request.body;
    const [extension] = url.match(/[^.]*$/);

    const parseStream = ctx.getParser(
        !parserName || parserName === 'automatic' ? extension : parserName,
    );

    const stream = ctx.getStreamFromUrl(url);
    const parsedStream = await parseStream(stream);

    ctx.body = {
        totalLines: await ctx.saveParsedStream(parsedStream),
    };
    ctx.status = 200;
};

export const checkChunkMiddleware = async ctx => {
    const {
        resumableChunkNumber,
        resumableIdentifier,
        resumableCurrentChunkSize,
    } = ctx.request.query;
    const chunkname = `${
        config.uploadDir
    }/${resumableIdentifier}.${resumableChunkNumber}`;
    const exists = await checkFileExists(chunkname, resumableCurrentChunkSize);
    ctx.status = exists ? 200 : 204;
};

const app = new Koa();

app.use(prepareUpload);

app.use(koaBodyParser());
app.use(route.post('/url', uploadUrl));

app.use(route.post('/:parserName', parseRequest));
app.use(route.post('/:parserName', uploadChunkMiddleware));

app.use(route.get('/:parserName', checkChunkMiddleware));

app.use(route.del('/clear', clearUpload));

export default app;
