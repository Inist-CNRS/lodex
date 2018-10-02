import Koa from 'koa';
import route from 'koa-route';
import mount from 'koa-mount';
import jwt from 'koa-jwt';
import { auth } from 'config';
import get from 'lodash.get';

import ezMasterConfig from '../../services/ezMasterConfig';
import repositoryMiddleware from '../../services/repositoryMiddleware';
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
import widget from './widget';
import run from './run';
import progress from './progress';

const app = new Koa();

app.use(ezMasterConfig);
app.use(repositoryMiddleware);

app.use(mount('/login', login));

app.use(
    jwt({
        secret: auth.cookieSecret,
        cookie: 'lodex_token',
        key: 'cookie',
        passthrough: true,
    }),
);
app.use(jwt({ secret: auth.headerSecret, key: 'header', passthrough: true }));

const isDevelopment = process.env.NODE_ENV === 'development';

app.use(async (ctx, next) => {
    if (
        get(ctx, 'state.cookie.role') === 'admin' &&
        (isDevelopment || get(ctx, 'state.header.role') === 'admin')
    ) {
        ctx.state.isAdmin = true;
    }
    if (!ctx.ezMasterConfig.userAuth) {
        return next();
    }
    if ((!isDevelopment && !ctx.state.cookie) || !ctx.state.header) {
        ctx.status = 401;
        ctx.cookies.set('lodex_token', '', { expires: new Date() });
        ctx.body = 'No authentication token found';
        return;
    }

    await next();
});

app.use(mount('/export', exportPublishedDataset));
app.use(mount('/facet', facet));
app.use(mount('/widget', widget));
app.use(mount('/run', run));
app.use(route.get('/publication', publication));

app.use(mount('/publishedDataset', publishedDataset));

app.use(async (ctx, next) => {
    if (
        (!isDevelopment && !ctx.state.cookie) ||
        !ctx.state.header ||
        (!isDevelopment && ctx.state.cookie.role === 'user') ||
        ctx.state.header.role === 'user'
    ) {
        ctx.status = 401;
        ctx.cookies.set('lodex_token', '', { expires: new Date() });
        ctx.body = 'No authentication token found';
        return;
    }

    await next();
});
app.use(mount('/characteristic', characteristic));
app.use(mount('/field', fieldRoutes));
app.use(mount('/parsing', parsing));
app.use(mount('/publish', publish));
app.use(mount('/upload', upload));
app.use(mount('/dataset', dataset));
app.use(route.get('/progress', progress));

app.use(async ctx => {
    ctx.status = 404;
});

export default app;
