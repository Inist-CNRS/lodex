// @ts-expect-error TS(2792): Cannot find module 'koa'. Did you mean to set the ... Remove this comment to see the full error message
import koa from 'koa';
// @ts-expect-error TS(2792): Cannot find module 'koa-mount'. Did you mean to se... Remove this comment to see the full error message
import mount from 'koa-mount';
// @ts-expect-error TS(2792): Cannot find module 'koa-route'. Did you mean to se... Remove this comment to see the full error message
import route from 'koa-route';
// @ts-expect-error TS(2792): Cannot find module 'koa-static'. Did you mean to s... Remove this comment to see the full error message
import serve from 'koa-static';
import path from 'path';

// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
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
