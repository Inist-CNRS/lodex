import * as exporters from '../../exporters';

export const getExporter = (type) => {
    switch (type) {
    case 'text/csv':
    case 'text/tab-separated-values':
        return exporters.csv;
    default:
        throw new Error(`Unsupported document type: ${type}`);
    }
};

export async function exportMiddleware(ctx) {
    const type = ctx.request.header['accept'];
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

export default async function exportPublishedDataset(ctx) {
    ctx.getExporter = getExporter;

    await exportMiddleware(ctx);
}
