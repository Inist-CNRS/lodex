// @ts-expect-error TS(7016): @ezs/core has no type declarations
import ezs from '@ezs/core';
import Koa from 'koa';
import compress from 'koa-compress';
import type { AddressInfo } from 'net';
import { Readable } from 'stream';
import { setTimeout as delay } from 'timers/promises';
import { closeIfHeadersSent, withEmptyFallback } from './streamHelper';

// Same shape as the /api/run and /api/export responses: a stream of chunks,
// with a fallback written when the routine sent nothing.
const createApp = (chunks: Iterable<unknown> | AsyncIterable<unknown>) => {
    const app = new Koa();
    app.silent = true;
    app.use(compress());
    app.use((ctx) => {
        ctx.type = 'application/json';
        ctx.body = Readable.from(chunks)
            .pipe(ezs.catch())
            .on('error', () => closeIfHeadersSent(ctx))
            .pipe(withEmptyFallback(() => '{"total":0}'))
            .pipe(ezs.toBuffer());
    });
    return app;
};

const get = async (
    chunks: Iterable<unknown> | AsyncIterable<unknown>,
    acceptEncoding = 'gzip',
) => {
    const server = createApp(chunks).listen(0);
    try {
        const response = await fetch(
            `http://localhost:${(server.address() as AddressInfo).port}/`,
            {
                headers: { 'Accept-Encoding': acceptEncoding },
                signal: AbortSignal.timeout(2000),
            },
        );
        return {
            status: response.status,
            encoding: response.headers.get('content-encoding'),
            body: await response.text(),
        };
    } finally {
        server.close();
    }
};

describe('withEmptyFallback', () => {
    it.each([
        ['gzip', 'gzip'],
        // What browsers send: koa-compress picks brotli
        ['gzip, deflate, br, zstd', 'br'],
    ])(
        'does not append the empty fallback to a response with data (Accept-Encoding: %s)',
        async (acceptEncoding, expectedEncoding) => {
            const { encoding, body } = await get(
                ['{"total":2,', '"data":[1,2]}'],
                acceptEncoding,
            );
            expect(encoding).toBe(expectedEncoding);
            expect(body).toBe('{"total":2,"data":[1,2]}');
        },
    );

    it('writes the empty fallback when the stream sends nothing', async () => {
        const { body } = await get([]);
        expect(body).toBe('{"total":0}');
    });

    it('passes errors from ezs.catch() on, so Koa answers with an error', async () => {
        const { status } = await get([new Error('routine failed')]);
        expect(status).toBe(500);
    });

    it('closes the connection when the routine fails after the headers are sent', async () => {
        async function* lateError() {
            yield '{"data":[1,';
            // let Koa send the headers before the routine fails
            await delay(50);
            yield new Error('routine failed');
        }
        await expect(get(lateError(), 'identity')).rejects.toThrow(
            'terminated',
        );
    });
});
