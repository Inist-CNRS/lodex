import rawBody from 'raw-body';
import streamBuffers from 'stream-buffers';

import * as loaders from '../../loaders';

export const getParser = (type) => {
    switch (type) {
    case 'text/csv':
    case 'text/tab-separated-values':
        return loaders.csv;
    default:
        throw new Error(`Unsupported document type: ${type}`);
    }
};

export async function uploadMiddleware(ctx) {
    const type = ctx.request.header['content-type'];

    await ctx.dataset.remove({});

    try {
        const parseStream = ctx.getParser(type);

        const buffer = await ctx.rawBody(ctx.req);
        const stream = new ctx.ReadableStreamBuffer({
            frequency: 10,   // in milliseconds.
            chunkSize: 2048,  // in bytes.
        });
        stream.put(buffer);
        stream.stop();
        const documents = await parseStream(stream);
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
    ctx.rawBody = rawBody;
    ctx.ReadableStreamBuffer = streamBuffers.ReadableStreamBuffer;

    await uploadMiddleware(ctx);
}
