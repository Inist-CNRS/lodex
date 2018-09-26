import koa from 'koa';
import route from 'koa-route';

import mongoClient from '../services/mongoClient';

const app = new koa();

app.use(mongoClient);

app.use(
    route.delete('/fixtures', async ctx => {
        await ctx.db.collection('publishedDataset').remove({});
        await ctx.db.collection('publishedCharacteristic').remove({});
        await ctx.db.collection('field').remove({});
        await ctx.db.collection('uriDataset').remove({});
        await ctx.db.collection('dataset').remove({});

        ctx.body = { status: 'ok' };
    }),
);

export default app;
