import Koa from 'koa';
import route from 'koa-route';
import rawBody from 'raw-body';
import stream from 'stream';
import streamToArray from 'stream-to-array';

import config from '../../../../config.json';
import loaders from '../../loaders';

export const getParser = (type) => {
    if (!loaders[type]) {
        throw new Error(`Unsupported document type: ${type}`);
    }

    return loaders[type](config.loader[type]);
};

export const requestToStream = (rawBodyImpl, PassThrough) => async (req) => {
    const buffer = await rawBodyImpl(req);
    const bufferStream = new PassThrough();
    bufferStream.end(buffer);

    return bufferStream;
};

export async function uploadMiddleware(ctx, type) {
    await ctx.dataset.remove({});

    try {
        const parseStream = ctx.getParser(type);

        const requestStream = await ctx.requestToStream(ctx.req);
        const parsedStream = await parseStream(requestStream);
        const documents = await ctx.streamToArray(parsedStream);

        await ctx.dataset.insertBatch(documents);
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

export const prepareUpload = async (ctx, next) => {
    ctx.getParser = getParser;
    ctx.requestToStream = requestToStream(rawBody, stream.PassThrough);
    ctx.streamToArray = streamToArray;

    await next();
};


const app = new Koa();

app.use(prepareUpload);

app.use(route.post('/:type', uploadMiddleware));

export default app;
