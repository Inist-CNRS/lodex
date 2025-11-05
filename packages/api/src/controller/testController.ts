import koa from 'koa';
import mount from 'koa-mount';
import route from 'koa-route';
import serve from 'koa-static';
import path from 'path';

import { DEFAULT_TENANT } from '@lodex/common';
import repositoryMiddleware, {
    mongoRootAdminClient,
} from '../services/repositoryMiddleware';
import { deleteTenant } from './rootAdmin';

const app = new koa();

app.use(repositoryMiddleware);
app.use(mongoRootAdminClient);

app.use(
    route.delete('/fixtures', async (ctx: any) => {
        await ctx.db.collection('publishedFacet').deleteMany();
        await ctx.db.collection('publishedDataset').deleteMany();
        await ctx.db.collection('publishedCharacteristic').deleteMany();
        await ctx.db.collection('hiddenResource').deleteMany();
        await ctx.db.collection('field').deleteMany();
        await ctx.db.collection('dataset').deleteMany();
        await ctx.db.collection('subresource').deleteMany();
        await ctx.db.collection('enrichment').deleteMany();
        await ctx.db.collection('precomputed').deleteMany();
        await ctx.db.collection('annotation').deleteMany();

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

export default app;
