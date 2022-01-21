import Koa from 'koa';
import route from 'koa-route';
import logger from '../../services/logger';

const app = new Koa();

export const clearDataset = async ctx => {
    try {
        await ctx.publishedDataset.remove({});
        await ctx.publishedCharacteristic.remove({});
        await ctx.publishedFacet.remove({});
        await ctx.field.remove({});
        await ctx.dataset.remove({});
        await ctx.subresource.remove({});
        await ctx.enrichment.remove({});

        ctx.body = { status: 'success' };
    } catch (error) {
        logger.error('clear dataset error', {
            error,
        });
        ctx.body = { status: 'error', error };
    }
};

export const getDataset = async ctx => {
    const { skip, limit } = ctx.query;
    const count = await ctx.dataset.find().count();
    const datas = await ctx.dataset
        .find()
        .skip(skip ? parseInt(skip) : 0)
        .limit(limit ? parseInt(limit, 10) : 10)
        .toArray();
    ctx.body = { count, datas };
};

app.use(route.delete('/', clearDataset));
app.use(route.get('/', getDataset));

export default app;
