import { Transform } from 'stream';

export const streamEnd = (fd: any) =>
    new Promise((resolve: any, reject: any) => {
        fd.on('end', () => resolve());
        fd.on('finish', () => resolve());
        fd.on('error', reject);
    });

/**
 * Passes data through. When the stream ends without any data, calls onEmpty
 * and sends what it returns, if anything.
 * Do not use ctx.headerSent for that: koa-compress buffers small responses,
 * so the headers are not sent yet when the stream ends, even with data.
 */
export const withEmptyFallback = (onEmpty: () => string | void) => {
    let hasData = false;
    return new Transform({
        objectMode: true,
        transform(chunk, _encoding, callback) {
            hasData = true;
            callback(null, chunk);
        },
        flush(callback) {
            callback(null, hasData ? undefined : onEmpty());
        },
    });
};
