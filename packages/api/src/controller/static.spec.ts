import fs from 'fs';
import Koa from 'koa';
import mount from 'koa-mount';
import type { AddressInfo } from 'net';
import os from 'os';
import path from 'path';
import { createStaticApp } from './static';

describe('static controller', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lodex-static-'));
    fs.writeFileSync(path.join(dir, 'asset.js'), 'console.log("asset");');
    fs.writeFileSync(path.join(dir, 'index.html'), '<h1>static</h1>');
    fs.mkdirSync(path.join(dir, 'chunks'));
    fs.writeFileSync(path.join(dir, 'chunks', 'front-a1b2.js'), 'chunk');

    const downstream = jest.fn((ctx: Koa.Context) => {
        ctx.body = 'downstream';
    });
    const app = new Koa();
    app.use(mount('/', createStaticApp([dir])));
    app.use(downstream);
    const server = app.listen(0);
    const get = (url: string) =>
        fetch(
            `http://localhost:${(server.address() as AddressInfo).port}${url}`,
        );

    afterEach(() => downstream.mockClear());
    afterAll(() => {
        server.close();
        fs.rmSync(dir, { recursive: true });
    });

    it('should serve an existing file without calling downstream middlewares', async () => {
        const response = await get('/asset.js');
        expect(await response.text()).toBe('console.log("asset");');
        expect(downstream).not.toHaveBeenCalled();
    });

    it('should cache hashed chunks forever, and revalidate other files', async () => {
        const chunk = await get('/chunks/front-a1b2.js');
        expect(chunk.headers.get('cache-control')).toBe(
            'public, max-age=31536000, immutable',
        );
        const entry = await get('/asset.js');
        expect(entry.headers.get('cache-control')).toBe('max-age=0');
    });

    it('should fall through for unknown files', async () => {
        const response = await get('/missing.js');
        expect(await response.text()).toBe('downstream');
        expect(downstream).toHaveBeenCalledTimes(1);
    });

    it('should not serve index.html for directory urls, so SSR keeps handling them', async () => {
        const response = await get('/');
        expect(await response.text()).toBe('downstream');
        expect(downstream).toHaveBeenCalledTimes(1);
    });
});
