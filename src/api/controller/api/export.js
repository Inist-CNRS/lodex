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
        ctx.keepDbOpened = true;

        const exportStreamFactory = ctx.getExporter(type);
        const characteristics = await ctx.publishedCharacteristic.find({}).toArray();
        const fields = await ctx.field.find({}).toArray();
        const publishedDatasetStream = await ctx.publishedDataset.find({}).stream();
        const exportStream = exportStreamFactory(fields, characteristics, publishedDatasetStream);

        exportStream.on('end', () => {
            ctx.db.close();
        });
        exportStream.on('error', (error) => {
            console.error(`Error while exporting published dataset into ${type}`, error);
            ctx.db.close();
        });

        ctx.set('Content-disposition', 'attachment; filename=export.csv');
        ctx.type = type;
        ctx.status = 200;
        ctx.body = exportStream;
    } catch (error) {
        ctx.status = 500;
        ctx.body = error.message;
    }
}

const app = new Koa();

app.use(setup);
app.use(route.get('/:type', exportMiddleware));

export default app;
