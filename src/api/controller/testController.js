import path from 'path';
import koa from 'koa';
import route from 'koa-route';
import serve from 'koa-static';
import mount from 'koa-mount';

import repositoryMiddleware from '../services/repositoryMiddleware';
import { mongo } from 'config';

const app = new koa();

const setTenant = async (ctx, next) => {
    ctx.tenant = ctx.cookies.get('lodex_tenant') || mongo.dbName;
    await next();
};

app.use(setTenant);

app.use(repositoryMiddleware);

app.use(
    route.delete('/fixtures', async ctx => {
        await ctx.db.collection('publishedDataset').remove({});
        await ctx.db.collection('publishedCharacteristic').remove({});
        await ctx.db.collection('field').remove({});
        await ctx.db.collection('dataset').remove({});
        await ctx.db.collection('subresource').remove({});
        await ctx.db.collection('enrichment').remove({});

        ctx.body = { status: 'ok' };
    }),
);

app.use(
    mount('/external', serve(path.resolve(__dirname, '../../../external'))),
);

export default app;
