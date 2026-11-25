import Koa from 'koa';
import type { AddressInfo } from 'net';
import { get, type IncomingMessage, type Server } from 'http';
import { bumpDataVersion, revalidateUntilDataChanges } from './dataVersion';

// not fetch: it sends Cache-Control: no-cache along a hand-set If-None-Match,
// as a forced reload does
const request = (url: string, etag?: string) =>
    new Promise<IncomingMessage>((resolve, reject) => {
        get(url, { headers: etag ? { 'If-None-Match': etag } : {} }, (res) => {
            res.resume();
            res.on('end', () => resolve(res));
        }).on('error', reject);
    });

describe('revalidateUntilDataChanges', () => {
    let server: Server;
    let url: string;
    let computed: number;

    beforeEach(async () => {
        computed = 0;
        const app = new Koa();
        app.use(async (ctx, next) => {
            (ctx as any).tenant = ctx.get('X-Lodex-Tenant') || 'default';
            await next();
        });
        app.use(revalidateUntilDataChanges);
        app.use((ctx) => {
            computed += 1;
            ctx.body = { total: computed };
        });
        server = app.listen(0);
        await new Promise((resolve) => server.once('listening', resolve));
        url = `http://localhost:${(server.address() as AddressInfo).port}`;
    });

    afterEach(() => new Promise((resolve) => server.close(resolve)));

    it('asks the browser to revalidate, with an ETag', async () => {
        const response = await request(url);

        expect(response.statusCode).toBe(200);
        expect(response.headers['cache-control']).toBe('no-cache');
        expect(response.headers.etag).toBeTruthy();
    });

    it('answers 304 without running the routine while the data is unchanged', async () => {
        const { etag } = (await request(url)).headers;

        const second = await request(url, etag);

        expect(second.statusCode).toBe(304);
        expect(computed).toBe(1);
    });

    it('runs the routine again once the data of the tenant changed', async () => {
        const { etag } = (await request(url)).headers;

        bumpDataVersion('default');
        const second = await request(url, etag);

        expect(second.statusCode).toBe(200);
        expect(second.headers.etag).not.toBe(etag);
        expect(computed).toBe(2);
    });

    it('keeps the cache of a tenant when another tenant changes', async () => {
        const { etag } = (await request(url)).headers;

        bumpDataVersion('other');
        const second = await request(url, etag);

        expect(second.statusCode).toBe(304);
    });
});
