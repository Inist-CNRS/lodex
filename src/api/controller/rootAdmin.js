import Koa from 'koa';
import route from 'koa-route';
import jwt from 'koa-jwt';
import { auth } from 'config';
import { mongoRootAdminClient } from '../services/repositoryMiddleware';

const app = new Koa();
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
    // if cookie is not root redirect
    if (ctx.state.cookie.role !== 'root') {
        ctx.status = 401;
        ctx.cookies.set('lodex_token', '', { expires: new Date() });
        ctx.body = 'No root token found';
        return;
    }

    if (!ctx.state.cookie) {
        ctx.status = 401;
        ctx.cookies.set('lodex_token', '', { expires: new Date() });
        ctx.body = 'No authentication token found';
        return;
    }

    await next();
});

app.use(mongoRootAdminClient);

const getTenant = async ctx => {
    ctx.body = await ctx.tenant.findAll();
};

const postTenant = async ctx => {
    ctx.body = await ctx.tenant.create({ name: 'toto' });
};

app.use(route.get('/tenant', getTenant));
app.use(route.post('/tenant', postTenant));

app.use(async ctx => {
    ctx.status = 404;
});

export default app;
