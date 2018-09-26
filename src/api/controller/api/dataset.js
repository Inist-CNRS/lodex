import Koa from 'koa';
import route from 'koa-route';

const app = new Koa();

export const clearDataset = async ctx => {
    try {
        await ctx.publishedDataset.remove({});
        await ctx.publishedCharacteristic.remove({});
        await ctx.publishedFacet.remove({});
        await ctx.field.remove({});
        await ctx.dataset.remove({});

        ctx.body = { status: 'success' };
    } catch (error) {
        ctx.body = { status: 'error', error };
    }
};

app.use(route.delete('/', clearDataset));

export default app;
