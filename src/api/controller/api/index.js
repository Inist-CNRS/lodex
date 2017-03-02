import Koa from 'koa';
import route from 'koa-route';
import mount from 'koa-mount';
import jwt from 'koa-jwt';
import { auth } from 'config';

import ezMasterConfig from '../../services/ezMasterConfig';
import initializeFields from '../../services/initializeFields';
import mongoClient from '../../services/mongoClient';

import characteristic from './characteristic';
import exportPublishedDataset from './export';
import fieldRoutes from './field';
import login from './login';
import parsing from './parsing';
import publication from './publication';
import publish from './publish';
import publishedDataset from './publishedDataset';
import upload from './upload';
import ark from './ark';

const app = new Koa();

app.use(ezMasterConfig);
app.use(mongoClient);
app.use(initializeFields);

app.use(mount('/export', exportPublishedDataset));
app.use(route.post('/login', login));
app.use(route.get('/publication', publication));
app.use(route.get('/ark', ark));

app.use(jwt({ secret: auth.cookieSecret, cookie: 'lodex_token', key: 'cookie', passthrough: true }));
app.use(jwt({ secret: auth.headerSecret, key: 'header', passthrough: true }));

app.use(mount('/publishedDataset', publishedDataset));

app.use(async (ctx, next) => {
    if (!ctx.state.cookie || !ctx.state.header) {
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

app.use(async (ctx) => {
    ctx.status = 404;
});

export default app;
