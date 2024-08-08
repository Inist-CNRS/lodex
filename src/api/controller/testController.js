import path from 'path';
import koa from 'koa';
import route from 'koa-route';
import serve from 'koa-static';
import mount from 'koa-mount';

import repositoryMiddleware, {
    mongoRootAdminClient,
} from '../services/repositoryMiddleware';
import { DEFAULT_TENANT } from '../../common/tools/tenantTools';

const app = new koa();

app.use(repositoryMiddleware);
app.use(mongoRootAdminClient);

app.use(
    route.delete('/fixtures', async (ctx) => {
        await ctx.db.collection('publishedDataset').drop();
        await ctx.db.collection('publishedCharacteristic').drop();
        await ctx.db.collection('field').drop();
        await ctx.db.collection('dataset').drop();
        await ctx.db.collection('subresource').drop();
        await ctx.db.collection('enrichment').drop();
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
