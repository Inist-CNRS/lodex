import Koa from 'koa';
import route from 'koa-route';
import jwt from 'koa-jwt';
import { auth } from 'config';

import mongoClient from '../../services/mongoClient';
import login from './login';
import upload from './upload';
import parsing from './parsing';
import publication from './publication';
import publish from './publish';
import publishedDataset from './publishedDataset';
import { getAllField, saveField, removeField } from './field';

const app = new Koa();

app.use(mongoClient);

app.use(route.post('/login', login));
app.use(route.get('/publication', publication));
app.use(route.get('/publishedDataset', publishedDataset));

app.use(route.get('/fields', getAllField));
app.use(route.put('/fields/:name', saveField));
app.use(route.del('/fields/:name', removeField));

app.use(jwt({ secret: auth.cookieSecret, cookie: 'lodex_token', key: 'cookie' }));
app.use(jwt({ secret: auth.headerSecret, key: 'header' }));

app.use(route.post('/upload', upload));
app.use(route.get('/parsing', parsing));
app.use(route.get('/publish', publish));

app.use(async (ctx) => {
    ctx.status = 404;
});

export default app;
