import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import route from 'koa-route';
import jwt from 'koa-jwt';
import { auth } from 'config';
import { ObjectId } from 'mongodb';
import { createWorkerQueue, deleteWorkerQueue } from '../workers';
import {
    ROOT_ROLE,
    checkForbiddenNames,
    checkNameTooLong,
} from '../../common/tools/tenantTools';
import bullBoard from '../bullBoard';
import { insertConfigTenant } from '../services/configTenant';
import mongoClient from '../services/mongoClient';

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
    if (!ctx.state.cookie) {
        ctx.status = 401;
        ctx.cookies.set('lodex_token_root', '', { expires: new Date() });
        ctx.body = { message: 'No authentication token found' };
        return;
    }

    if (ctx.state.cookie.role !== ROOT_ROLE) {
        ctx.status = 401;
        ctx.cookies.set('lodex_token_root', '', { expires: new Date() });
        ctx.body = { message: 'No root token found' };
        return;
    }

    await next();
});

app.use(koaBodyParser());

const getTenants = async (ctx, filter) => {
    const tenants = await ctx.tenantCollection.findAll(filter);

    for (const tenant of tenants) {
        const db = await mongoClient(tenant.name);

        tenant.totalSize = (await db.stats({ scale: 1024 })).totalSize;

        try {
            tenant.dataset = await db
                .collection('dataset')
                .find()
                .count();
        } catch (e) {
            tenant.dataset = 0;
        }

        try {
            tenant.published =
                (await db
                    .collection('publishedDataset')
                    .find()
                    .count()) > 0;
        } catch (e) {
            tenant.published = false;
        }
    }

    return tenants;
};

const getTenant = async ctx => {
    ctx.body = await getTenants(ctx, { createdAt: -1 });
};

const postTenant = async ctx => {
    const { name, description, author } = ctx.request.body;
    const tenantExists = await ctx.tenantCollection.count({ name });
    if (tenantExists || checkForbiddenNames(name)) {
        ctx.status = 403;
        ctx.body = { error: `Invalid name: "${name}"` };
    } else if (checkNameTooLong(name)) {
        ctx.status = 403;
        ctx.body = { error: `Tenant name: "${name}" too long` };
    } else {
        await ctx.tenantCollection.create({
            name,
            description,
            author,
            username: 'admin',
            password: 'secret',
            createdAt: new Date(),
        });

        // Open configTenant files as json and save it in mongo
        insertConfigTenant(name);

        const queue = createWorkerQueue(name, 1);
        bullBoard.addDashboardQueue(name, queue);
        ctx.body = await getTenants(ctx, { createdAt: -1 });
    }
};

const putTenant = async (ctx, id) => {
    const { description, author, username, password } = ctx.request.body;
    const tenantExists = await ctx.tenantCollection.findOneById(id);

    if (!tenantExists) {
        ctx.throw(403, `Invalid id: "${id}"`);
    }

    const update = { description, author, username, password };
    await ctx.tenantCollection.update(id, update);
    ctx.body = await getTenants(ctx, { createdAt: -1 });
};

const deleteTenant = async ctx => {
    const { _id, name, deleteDatabase } = ctx.request.body;
    const tenantExists = await ctx.tenantCollection.findOne({
        _id: new ObjectId(_id),
        name,
    });
    if (!tenantExists || name !== tenantExists.name) {
        ctx.status = 403;
        ctx.body = { error: `Invalid name: "${name}"` };
    } else {
        deleteWorkerQueue(tenantExists.name).then();
        bullBoard.removeDashboardQueue(tenantExists.name);
        if (deleteDatabase) {
            const db = await mongoClient(name);
            await db.dropDatabase();
        }
        await ctx.tenantCollection.deleteOne(tenantExists);
        ctx.body = await getTenants(ctx);
    }
};

app.use(route.get('/tenant', getTenant));
app.use(route.post('/tenant', postTenant));
app.use(route.put('/tenant/:id', putTenant));
app.use(route.delete('/tenant', deleteTenant));

app.use(async ctx => {
    ctx.status = 404;
});

export default app;
