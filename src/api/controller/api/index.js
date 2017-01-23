import Koa from 'koa';
import route from 'koa-route';
import jwt from 'koa-jwt';
import { auth } from 'config';

import mongoClient from '../../services/mongoClient';
import login from './login';
import upload from './upload';

const app = new Koa();

app.use(async (ctx, next) => {
    ctx.db = await mongoClient();
    try {
        await next();
    } finally {
        console.log('closing db');
        await ctx.db.close();
    }
});

app.use(route.post('/login', login));
app.use(route.post('/upload', upload));

app.use(jwt({ secret: auth.cookieSecret, cookie: 'lodex_token', key: 'cookie' }));
app.use(jwt({ secret: auth.headerSecret, key: 'header' }));
app.use(route.get('/protected', (ctx) => {
    ctx.body = 'I am protected';
}));

export default app;
