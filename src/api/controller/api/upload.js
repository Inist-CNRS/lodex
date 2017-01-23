import rawBody from 'raw-body';
import streamBuffers from 'stream-buffers';

import * as parsers from '../../parsers';
import dataset from '../../models/dataset';
import error from '../../models/error';

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

    const parseStream = getParser(type);

    const buffer = await rawBody(ctx.req);
    const stream = new streamBuffers.ReadableStreamBuffer({
        frequency: 10,   // in milliseconds.
        chunkSize: 2048,  // in bytes.
    });
    stream.put(buffer);
    stream.stop();
    const { documents, errors } = await parseStream(stream);
    await error(ctx.db).insertBatch(errors);
    await dataset(ctx.db).insertBatch(documents);
    ctx.status = 200;
    ctx.body = {
        documents,
        errors,
    };
}
