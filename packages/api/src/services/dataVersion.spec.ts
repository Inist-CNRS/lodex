import Koa from 'koa';
import type { AddressInfo } from 'net';
import { get, type IncomingMessage, type Server } from 'http';
import {
    bumpAfterAdminWrite,
    bumpDataVersion,
    doNotKeep,
    getDataVersion,
    revalidateUntilDataChanges,
} from './dataVersion';

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

describe('bumpAfterAdminWrite', () => {
    const bumps = async ({
        method = 'POST',
        path = '/field',
        status = 200,
        isAdmin = true,
    }) => {
        const tenant = `tenant-${Math.random()}`;
        const ctx: any = { method, path, tenant, state: { isAdmin } };
        const before = getDataVersion(tenant);
        await bumpAfterAdminWrite(ctx, async () => {
            ctx.status = status;
        });
        return getDataVersion(tenant) !== before;
    };

    it('bumps after a successful write of an admin', async () => {
        expect(await bumps({})).toBe(true);
        expect(
            await bumps({ method: 'DELETE', path: '/hiddenResource/x' }),
        ).toBe(true);
    });

    it('does not bump for a visitor', async () => {
        expect(await bumps({ isAdmin: false })).toBe(false);
    });

    it('does not bump for a rejected or failed write', async () => {
        expect(await bumps({ status: 400 })).toBe(false);
        expect(await bumps({ status: 500 })).toBe(false);
    });

    it('does not bump for a read', async () => {
        expect(await bumps({ method: 'GET' })).toBe(false);
        expect(await bumps({ path: '/publishedDataset' })).toBe(false);
        expect(await bumps({ path: '/publishedDataset/search' })).toBe(false);
        expect(await bumps({ path: '/enrichment/preview' })).toBe(false);
        expect(await bumps({ path: '/dataSource/preview' })).toBe(false);
    });
});

describe('doNotKeep', () => {
    it('sends an answer the browser does not store', async () => {
        const app = new Koa();
        app.use(async (ctx, next) => {
            (ctx as any).tenant = 'default';
            await next();
        });
        app.use(revalidateUntilDataChanges);
        app.use((ctx) => {
            doNotKeep(ctx);
            ctx.body = { total: 0 };
        });
        const server = app.listen(0);
        await new Promise((resolve) => server.once('listening', resolve));

        const response = await request(
            `http://localhost:${(server.address() as AddressInfo).port}`,
        );
        await new Promise((resolve) => server.close(resolve));

        expect(response.headers['cache-control']).toBe('no-store');
        expect(response.headers.etag).toBeUndefined();
    });
});
