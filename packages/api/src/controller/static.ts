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

// Mounted before the tenant, Mongo and Redis middlewares so assets are served
// without any database round-trip. Unknown files fall through to the next middleware.
// index: false keeps extensionless URLs (e.g. `/`) for server side rendering.
// Precompressed .br/.gz files (see bin/compress-build.mjs) are served when available.
export const createStaticApp = (dirs = STATIC_DIRS) => {
    const app = new Koa();
    dirs.forEach((dir) => app.use(serve(dir, { index: false })));
    return app;
};

export default createStaticApp();
