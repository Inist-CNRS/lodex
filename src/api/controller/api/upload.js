import Koa from 'koa';
import route from 'koa-route';
import asyncBusboy from 'async-busboy';
import fs from 'fs';
import config from 'config';

import jsonConfig from '../../../../config.json';
import loaders from '../../loaders';
import saveStream from '../../services/saveStream';

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

export const saveStreamInFile = (stream, filename) =>
    new Promise((resolve, reject) => {
        const writableStream = fs.createWriteStream(filename);

        stream.pipe(writableStream);

        stream.on('end', resolve);
        stream.on('error', reject);
    });

export const clearUpload = async (ctx) => {
    await ctx.dataset.remove({});
    ctx.body = true;
};

export async function uploadFileMiddleware(ctx, type) {
    try {
        const parseStream = ctx.getParser(type);
        const requestStream = await ctx.requestToStream(ctx.req);
        const parsedStream = await parseStream(requestStream);

        await ctx.saveStream(parsedStream, ctx.dataset.insertMany.bind(ctx.dataset));
        await ctx.field.initializeModel();

        ctx.status = 200;
        ctx.body = {
            totalLines: await ctx.dataset.count(),
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = error.message;
    }
}

const fsStats = filename =>
    new Promise((resolve, reject) => {
        fs.stat(filename, (error, result) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(result);
        });
    });

const fsExists = async (filename) => {
    try {
        const stats = await fsStats(filename);

        return stats.isFile();
    } catch (e) {
        return false;
    }
};

export const getChunkSize = async (identifier, chunkNumber) => {
    try {
        const filename = `${config.uploadDir}/${identifier}.${chunkNumber}`;
        const { size } = await fsStats(filename);
        return parseInt(size, 10);
    } catch (error) {
        return 0;
    }
};

export const checkChunkExists = async (identifier, chunkNumber, chunkSize) =>
    (await getChunkSize(identifier, chunkNumber)) === parseInt(chunkSize, 10);

export const isUploadComplete = async (identifier, totalChunk, totalSize) => {
    const loop = async (chunkNumber, curSize = 0) => {
        if (chunkNumber > totalChunk) {
            return totalSize === curSize;
        }

        const chunkSize = await getChunkSize(identifier, chunkNumber);
        if (chunkSize === 0) {
            return false;
        }

        return loop(chunkNumber + 1, curSize + chunkSize);
    };

    return loop(1);
};

export const append = (writeStream, readStream) =>
    new Promise((resolve, reject) => {
        readStream.pipe(writeStream, {
            end: false,
        });
        readStream.on('end', resolve);
        readStream.on('error', reject);
    });

export const chunksToStream = async (identifier) => {
    const stream = fs.createWriteStream('upload/file');
    const loop = async (number) => {
        const chunkFilename = `${config.uploadDir}/${identifier}.${number}`;
        const exists = await fsExists(chunkFilename);
        if (exists) {
            const sourceStream = fs.createReadStream(chunkFilename);
            await append(stream, sourceStream);
            return loop(number + 1);
        }
        stream.end();

        return fs.createReadStream('upload/file');
    };

    return loop(1);
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

        if (await checkChunkExists(resumableIdentifier, resumableChunkNumber, resumableCurrentChunkSize)) {
            ctx.status = 200;
            return;
        }

        await saveStreamInFile(stream, `${config.uploadDir}/${resumableIdentifier}.${resumableChunkNumber}`);

        if (await isUploadComplete(resumableIdentifier, resumableTotalChunks, parseInt(resumableTotalSize, 10))) {
            const parseStream = ctx.getParser(type);

            const chunkStream = await chunksToStream(resumableIdentifier);
            const parsedStream = await parseStream(chunkStream);

            await ctx.saveStream(parsedStream, ctx.dataset.insertMany.bind(ctx.dataset));
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
    const exists = await checkChunkExists(resumableIdentifier, resumableChunkNumber, resumableCurrentChunkSize);
    ctx.status = exists ? 200 : 204;
};

const app = new Koa();

app.use(prepareUpload);

app.use(route.post('/:type', uploadChunkMiddleware));
app.use(route.get('/:type', checkChunkMiddleware));
app.use(route.del('/clear', clearUpload));

export default app;
