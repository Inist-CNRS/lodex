import Koa from 'koa';
import compress from 'koa-compress';
import type { AddressInfo } from 'net';
import { PassThrough, Readable } from 'stream';
import { withEmptyFallback } from './streamHelper';

// Same shape as the /api/run and /api/export responses: a stream of chunks,
// with a fallback written when the routine sent nothing.
const createApp = (chunks: string[]) => {
    const app = new Koa();
    app.use(compress());
    app.use((ctx) => {
        ctx.type = 'application/json';
        ctx.body = Readable.from(chunks)
            .pipe(withEmptyFallback(() => '{"total":0}'))
            .pipe(new PassThrough());
    });
    return app;
};

const get = async (chunks: string[]) => {
    const server = createApp(chunks).listen(0);
    try {
        const response = await fetch(
            `http://localhost:${(server.address() as AddressInfo).port}/`,
            { headers: { 'Accept-Encoding': 'gzip' } },
        );
        return {
            encoding: response.headers.get('content-encoding'),
            body: await response.text(),
        };
    } finally {
        server.close();
    }
};

describe('withEmptyFallback', () => {
    it('does not append the empty fallback to a compressed response with data', async () => {
        const { encoding, body } = await get(['{"total":2,', '"data":[1,2]}']);
        expect(encoding).toBe('gzip');
        expect(body).toBe('{"total":2,"data":[1,2]}');
    });

    it('writes the empty fallback when the stream sends nothing', async () => {
        const { body } = await get([]);
        expect(body).toBe('{"total":0}');
    });
});
