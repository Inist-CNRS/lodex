import Koa from 'koa';
import route from 'koa-route';
import mount from 'koa-mount';
import jwt from 'koa-jwt';
import { auth, mongo } from 'config';
import get from 'lodash.get';
import backup from 'mongodb-backup';
import mime from 'mime';
import fs from 'fs';
import os from 'os';

import ezMasterConfig from '../../services/ezMasterConfig';
import characteristic from './characteristic';
import exportPublishedDataset from './export';
import facet from './facet';
import fieldRoutes from './field';
import login from './login';
import parsing from './parsing';
import publication from './publication';
import publish from './publish';
import publishedDataset from './publishedDataset';
import dataset from './dataset';
import upload from './upload';
import run from './run';
import progress from './progress';
import breadcrumbs from './breadcrumb';
import menu from './menu';
import loader from './loader';
import translate from './translate';
import subresource from './subresource';

const app = new Koa();

app.use(ezMasterConfig);

app.use(mount('/login', login));
app.use(route.get('/breadcrumb', breadcrumbs));
app.use(route.get('/menu', menu));
app.use(mount('/translations', translate));

app.use(
    jwt({
        secret: auth.cookieSecret,
        cookie: 'lodex_token',
        key: 'cookie',
        passthrough: true,
    }),
);
app.use(jwt({ secret: auth.headerSecret, key: 'header', passthrough: true }));

app.use(async (ctx, next) => {
    if (
        get(ctx, 'state.cookie.role') === 'admin' &&
        get(ctx, 'state.header.role') === 'admin'
    ) {
        ctx.state.isAdmin = true;
    }
    if (!ctx.ezMasterConfig.userAuth) {
        return next();
    }
    if (!ctx.state.cookie || !ctx.state.header) {
        ctx.status = 401;
        ctx.cookies.set('lodex_token', '', { expires: new Date() });
        ctx.body = 'No authentication token found';
        return;
    }

    await next();
});

app.use(mount('/export', exportPublishedDataset));
app.use(mount('/facet', facet));
app.use(mount('/run', run));
app.use(route.get('/publication', publication));
app.use(mount('/publishedDataset', publishedDataset));

app.use(async (ctx, next) => {
    if (!ctx.state.cookie || !ctx.state.header) {
        ctx.status = 401;
        ctx.cookies.set('lodex_token', '', { expires: new Date() });
        ctx.body = 'No authentication token found';
        return;
    }

    if (
        get(ctx, 'state.cookie.role') === 'user' &&
        get(ctx, 'state.header.role') === 'user'
    ) {
        ctx.status = 404;
        return;
    }

    if (
        get(ctx, 'state.cookie.role') !== 'admin' ||
        get(ctx, 'state.header.role') !== 'admin'
    ) {
        ctx.status = 403;
        ctx.body = 'Forbidden';
        return;
    }

    await next();
});
app.use(mount('/characteristic', characteristic));
app.use(mount('/field', fieldRoutes));
app.use(mount('/subresource', subresource));
app.use(mount('/parsing', parsing));
app.use(mount('/publish', publish));
app.use(mount('/upload', upload));
app.use(mount('/dataset', dataset));
app.use(route.get('/progress', progress));
app.use(mount('/loader', loader));

const streamEnd = fd =>
    new Promise((resolve, reject) => {
        fd.on('end', () => {
            resolve();
        });
        fd.on('finish', () => {
            resolve();
        });
        fd.on('error', reject);
    });

const dump = async ctx => {
    const filename =
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .substring(2) +
        '.tar';
    const pathname = `${os.tmpdir()}/${filename}`;

    await new Promise(resolve =>
        backup({
            uri: `mongodb://${mongo.host}/${mongo.dbName}`,
            root: os.tmpdir(),
            collections: ['dataset', 'field', 'subresource'],
            tar: filename,
            parser: 'json',
            callback: resolve,
        }),
    );

    const mimetype = mime.lookup(pathname);
    ctx.set('Content-disposition', `attachment; filename=${filename}`);
    ctx.set('Content-type', mimetype);
    ctx.status = 200;

    try {
        const readStream = fs.createReadStream(pathname);
        readStream.pipe(ctx.res);

        await streamEnd(readStream).then(
            () => new Promise(r => fs.unlink(pathname, r)),
        );
    } catch (e) {
        ctx.status = 500;
    }
};

app.use(route.get('/dump', dump));

app.use(async ctx => {
    ctx.status = 404;
});

export default app;
