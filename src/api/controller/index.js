import Koa from 'koa';
import route from 'koa-route';
import jwt from 'koa-jwt';
import { auth } from 'config';

import login from './login';

const app = new Koa();

app.use(route.post('/login', login));

app.use(jwt({ secret: auth.cookieSecret, cookie: 'bibapi_token', key: 'cookie' }));
app.use(jwt({ secret: auth.headerSecret, key: 'header' }));
app.use(route.get('/protected', (ctx) => {
    ctx.body = 'I am protected';
}));

export default app;
