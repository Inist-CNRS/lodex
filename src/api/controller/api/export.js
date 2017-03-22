import Koa from 'koa';
import route from 'koa-route';
import { host } from 'config';

import exporters from '../../exporters';

export const getExporter = (type) => {
    const exporter = exporters[type];

    if (!exporter) {
        throw new Error(`Unsupported document type: ${type}`);
    }

    return exporter;
};

export async function setup(ctx, next) {
    ctx.getExporter = getExporter;
    await next();
}

export async function exportMiddleware(ctx, type) {
    try {
        ctx.keepDbOpened = true;

        const exportStreamFactory = ctx.getExporter(type);
        const characteristics = await ctx.publishedCharacteristic.findAllVersions();
        const fields = await ctx.field.findAll();

        const searchableFieldNames = await ctx.field.findSearchableNames();
        const facetFieldNames = await ctx.field.findFacetNames();

        const { uri, match, sortBy, sortDir, ...facets } = ctx.request.query;
        const publishedDatasetStream = ctx.publishedDataset.getFindAllStream(
            uri,
            match,
            searchableFieldNames,
            facets,
            facetFieldNames,
            sortBy,
            sortDir,
        );

        const exportStream = exportStreamFactory(
            fields,
            characteristics,
            publishedDatasetStream,
            ctx.request.query,
            host,
        );

        exportStream.on('end', () => {
            ctx.db.close();
        });
        exportStream.on('error', (error) => {
            global.console.error(`Error while exporting published dataset into ${type}`, error);
            ctx.db.close();
        });

        ctx.set('Content-disposition', `attachment; filename=export.${exportStreamFactory.extension}`);
        ctx.type = exportStreamFactory.mimeType;
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
