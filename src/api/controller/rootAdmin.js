import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import route from 'koa-route';
import jwt from 'koa-jwt';
import { auth } from 'config';
import { ObjectId } from 'mongodb';
import { createWorkerQueue, deleteWorkerQueue } from '../workers';
import { mongoRootAdminClient } from '../services/repositoryMiddleware';
import { checkForbiddenNames } from '../../common/tools/tenantTools';

import bullBoard from '../bullBoard';

const app = new Koa();
app.use(
    jwt({
        secret: auth.cookieSecret,
        cookie: 'lodex_token_root',
        key: 'cookie',
        passthrough: true,
    }),
);
app.use(jwt({ secret: auth.headerSecret, key: 'header', passthrough: true }));

app.use(async (ctx, next) => {
    // if cookie is not root redirect
    if (ctx.state.cookie.role !== 'root') {
        ctx.status = 401;
        ctx.cookies.set('lodex_token_root', '', { expires: new Date() });
        ctx.body = 'No root token found';
        return;
    }

    if (!ctx.state.cookie) {
        ctx.status = 401;
        ctx.cookies.set('lodex_token_root', '', { expires: new Date() });
        ctx.body = 'No authentication token found';
        return;
    }

    await next();
});

app.use(mongoRootAdminClient);
app.use(koaBodyParser());

const getTenant = async ctx => {
    ctx.body = await ctx.tenant.findAll();
};

const postTenant = async ctx => {
    const { name } = ctx.request.body;
    const tenantExists = await ctx.tenant.count({ name });
    if (tenantExists || checkForbiddenNames(name)) {
        ctx.status = 401;
        ctx.body = { error: `Invalid name: "${name}"` };
    } else {
        await ctx.tenant.create({ name });
        const queue = createWorkerQueue(name, 1);
        bullBoard.addDashboardQueue(name, queue);
        ctx.body = await ctx.tenant.findAll();
    }
};

const deleteTenant = async ctx => {
    const { _id, name } = ctx.request.body;
    const tenantExists = await ctx.tenant.findOne({
        _id: new ObjectId(_id),
        name,
    });
    if (!tenantExists || name !== tenantExists.name) {
        ctx.status = 401;
        ctx.body = { error: `Invalid name: "${name}"` };
    } else {
        deleteWorkerQueue(tenantExists.name);
        bullBoard.removeDashboardQueue(tenantExists.name);
        await ctx.tenant.deleteOne(tenantExists);
        ctx.body = await ctx.tenant.findAll();
    }
};

app.use(route.get('/tenant', getTenant));
app.use(route.post('/tenant', postTenant));
app.use(route.delete('/tenant', deleteTenant));

app.use(async ctx => {
    ctx.status = 404;
});

export default app;
