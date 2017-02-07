import Koa from 'koa';
import route from 'koa-route';

import * as exporters from '../../exporters';

export const getExporter = (type) => {
    switch (type) {
    case 'csv':
        return exporters.csv;
    default:
        throw new Error(`Unsupported document type: ${type}`);
    }
};

export async function setup(ctx, next) {
    ctx.getExporter = getExporter;
    await next();
}

export async function exportMiddleware(ctx, type) {
    try {
        const exportStreamFactory = ctx.getExporter(type);
        const characteristics = await ctx.publishedCharacteristic.find({}).toArray();
        const fields = await ctx.field.find({}).toArray();
        const publishedDatasetStream = await ctx.publishedDataset.find({}).stream();

        ctx.set('Content-disposition', 'attachment; filename=export.csv');
        ctx.type = type;
        ctx.status = 200;
        ctx.body = exportStreamFactory(fields, characteristics, publishedDatasetStream);
    } catch (error) {
        ctx.status = 500;
        ctx.body = error.message;
    }
}

const app = new Koa();

app.use(setup);
app.use(route.get('/:type', exportMiddleware));

export default app;
