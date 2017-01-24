import rawBody from 'raw-body';
import streamBuffers from 'stream-buffers';

import * as parsers from '../../parsers';
import dataset from '../../models/dataset';
import parsingResult from '../../models/parsingResult';

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

    await parsingResult(ctx.db).remove({});
    await dataset(ctx.db).remove({});
    const parseStream = getParser(type);

    const buffer = await rawBody(ctx.req);
    const stream = new streamBuffers.ReadableStreamBuffer({
        frequency: 10,   // in milliseconds.
        chunkSize: 2048,  // in bytes.
    });
    stream.put(buffer);
    stream.stop();
    const { documents, parsingData } = await parseStream(stream);
    await dataset(ctx.db).insertBatch(documents);
    await parsingResult(ctx.db).insert(parsingData);
    ctx.status = 200;
    ctx.body = parsingData;
}
