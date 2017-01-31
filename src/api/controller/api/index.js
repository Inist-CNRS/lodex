import Koa from 'koa';
import route from 'koa-route';
import mount from 'koa-mount';
import jwt from 'koa-jwt';
import { auth } from 'config';

import ezMasterConfig from '../../services/ezMasterConfig';
import initializeFields from '../../services/initializeFields';
import mongoClient from '../../services/mongoClient';

import fieldRoutes from './field';
import login from './login';
import parsing from './parsing';
import publication from './publication';
import publish from './publish';
import publishedDataset from './publishedDataset';
import upload from './upload';

const app = new Koa();

app.use(ezMasterConfig);
app.use(mongoClient);
app.use(initializeFields);

app.use(route.post('/login', login));
app.use(route.get('/publication', publication));
app.use(route.get('/publishedDataset', publishedDataset));

app.use(mount('/field', fieldRoutes));

app.use(jwt({ secret: auth.cookieSecret, cookie: 'lodex_token', key: 'cookie' }));
app.use(jwt({ secret: auth.headerSecret, key: 'header' }));

app.use(route.post('/upload', upload));
app.use(route.get('/parsing', parsing));
app.use(route.get('/publish', publish));

app.use(async (ctx) => {
    ctx.status = 404;
});

export default app;
