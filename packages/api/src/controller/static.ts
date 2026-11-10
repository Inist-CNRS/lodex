import type { ServerResponse } from 'http';
import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';

// Order matters: the first directory containing the requested file wins.
export const STATIC_DIRS = [
    '../../../../src/app/build',
    '../../../root-admin-app/build',
    '../../../admin-app/build',
    '../../../public-app/build',
    '../../../../src/app/custom',
].map((dir) => path.resolve(__dirname, dir));

// Files under chunks/ have a content hash in their name (see the vite configs):
// they never change, so browsers can keep them forever.
// Other files (entry points, themes) keep koa-send's default: revalidation with Last-Modified.
const setHeaders = (res: ServerResponse, filePath: string) => {
    if (filePath.includes(`${path.sep}chunks${path.sep}`)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
};

// Mounted before the tenant, Mongo and Redis middlewares so assets are served
// without any database round-trip. Unknown files fall through to the next middleware.
// index: false keeps extensionless URLs (e.g. `/`) for server side rendering.
// Precompressed .br/.gz files (see bin/compress-build.mjs) are served when available.
export const createStaticApp = (dirs = STATIC_DIRS) => {
    const app = new Koa();
    dirs.forEach((dir) => app.use(serve(dir, { index: false, setHeaders })));
    return app;
};

export default createStaticApp();
