import koa from 'koa';
import mount from 'koa-mount';
import route from 'koa-route';
import serve from 'koa-static';
import path from 'path';

import { DEFAULT_TENANT } from '../../common/tools/tenantTools';
import repositoryMiddleware, {
    mongoRootAdminClient,
} from '../services/repositoryMiddleware';

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

        await ctx.rootAdminDb
            .collection('tenant')
            .deleteOne({ name: { $ne: DEFAULT_TENANT } });
        ctx.body = { status: 'ok' };
    }),
);

app.use(
    mount('/external', serve(path.resolve(__dirname, '../../../external'))),
);

export default app;
