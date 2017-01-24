import rawBody from 'raw-body';
import streamBuffers from 'stream-buffers';

import * as parsers from '../../parsers';

const getParser = (type) => {
    switch (type) {
    case 'text/csv':
    case 'text/tab-separated-values':
        return parsers.csv;
    default:
        throw new Error(`Unsupported document type: ${type}`);
    }
};

export default async function upload(ctx) {
    const type = ctx.request.header['content-type'];

    await ctx.dataset.remove({});
    const parseStream = getParser(type);

    const buffer = await rawBody(ctx.req);
    const stream = new streamBuffers.ReadableStreamBuffer({
        frequency: 10,   // in milliseconds.
        chunkSize: 2048,  // in bytes.
    });
    stream.put(buffer);
    stream.stop();
    try {
        const documents = await parseStream(stream);
        await ctx.dataset.insertBatch(documents);
        ctx.status = 200;
        ctx.body = {
            totalLines: documents.length,
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = error.message;
    }
}
