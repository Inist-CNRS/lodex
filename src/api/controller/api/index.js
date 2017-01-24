import Koa from 'koa';
import route from 'koa-route';
import jwt from 'koa-jwt';
import { auth } from 'config';

import mongoClient from '../../services/mongoClient';
import login from './login';
import upload from './upload';
import dataset from '../../models/dataset';
import parsingResult from '../../models/parsingResult';
import parsing from './parsing';

const app = new Koa();

app.use(async (ctx, next) => {
    ctx.db = await mongoClient();
    ctx.dataset = dataset(ctx.db);
    ctx.parsingResult = parsingResult(ctx.db);
    try {
        await next();
    } finally {
        await ctx.db.close();
    }
});

app.use(route.post('/login', login));

app.use(jwt({ secret: auth.cookieSecret, cookie: 'lodex_token', key: 'cookie' }));
app.use(jwt({ secret: auth.headerSecret, key: 'header' }));
app.use(route.post('/upload', upload));
app.use(route.get('/parsing', parsing));

export default app;
