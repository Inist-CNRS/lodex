import koa from 'koa';
import mount from 'koa-mount';
import route from 'koa-route';
import serve from 'koa-static';
import path from 'path';

import { DEFAULT_TENANT } from '@lodex/common';
import bodyParser from 'koa-bodyparser';
import repositoryMiddleware, {
    mongoRootAdminClient,
} from '../services/repositoryMiddleware';
import { deleteTenant } from './rootAdmin';

const app = new koa();

app.use(repositoryMiddleware);
app.use(mongoRootAdminClient);

app.use(
    route.delete('/fixtures', async (ctx: any) => {
        const collections = await ctx.db.listCollections();
        for await (const collection of collections) {
            if (collection.name !== 'configTenant') {
                await ctx.db.collection(collection.name).deleteMany();
            }
        }

        const tenantsToDelete = await ctx.rootAdminDb
            .collection('tenant')
            .find({ name: { $ne: DEFAULT_TENANT } })
            .toArray();

        for (const tenant of tenantsToDelete) {
            await deleteTenant({
                tenantCollection: ctx.tenantCollection,
                request: {
                    body: {
                        _id: tenant._id,
                        name: tenant.name,
                        deleteDatabase: true,
                    },
                },
            });
        }
        ctx.body = { status: 'ok' };
    }),
);

app.use(
    mount('/external', serve(path.resolve(__dirname, '../../../../external'))),
);

app.use(bodyParser());

app.use(
    route.all('/enrichment/idempotent', async (ctx: koa.Context) => {
        ctx.type = 'application/json';
        ctx.body = ctx.request.body;
    }),
);

export default app;
