import rawBody from 'raw-body';
import streamBuffers from 'stream-buffers';
import streamToArray from 'stream-to-array';

import config from '../../../../config.json';
import loaders from '../../loaders';

export const getParser = (type) => {
    if (!loaders[type]) {
        throw new Error(`Unsupported document type: ${type}`);
    }

    return loaders[type](config.loader[type]);
};

export const requestToStream = (rawBodyImpl, ReadableStreamBuffer) => async (req) => {
    const buffer = await rawBodyImpl(req);
    const stream = new ReadableStreamBuffer({
        frequency: 10,   // in milliseconds.
        chunkSize: 2048,  // in bytes.
    });
    stream.put(buffer);
    stream.stop();

    return stream;
};

export async function uploadMiddleware(ctx) {
    const type = ctx.request.header['content-type'];

    await ctx.dataset.remove({});

    try {
        const parseStream = ctx.getParser(type);

        const stream = await ctx.requestToStream(ctx.req);
        const parsedStream = await parseStream(stream);
        const documents = await ctx.streamToArray(parsedStream);

        await ctx.dataset.insertBatch(documents);
        ctx.status = 200;
        ctx.body = {
            totalLines: await ctx.dataset.count(),
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = error.message;
    }
}

export default async function upload(ctx) {
    ctx.getParser = getParser;
    ctx.requestToStream = requestToStream(rawBody, streamBuffers.ReadableStreamBuffer);
    ctx.streamToArray = streamToArray;

    await uploadMiddleware(ctx);
}
