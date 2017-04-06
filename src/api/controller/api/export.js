import Koa from 'koa';
import route from 'koa-route';
import { host } from 'config';
import config from '../../../../config.json';

import exporters from '../../exporters';

export const getExporter = (type) => {
    const exporter = exporters[type];

    if (!exporter) {
        throw new Error(`Unsupported document type: ${type}`);
    }

    return exporter;
};

export const getExporterConfig = () => ({
    ...config,
    host,
});

export async function exportFileMiddleware(ctx, type, exportStreamFactory, exporterConfig) {
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
        exporterConfig,
        fields,
        characteristics,
        publishedDatasetStream,
        ctx.request.query,
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
}

export async function exportWidgetMiddleware(ctx, type) {
    const fields = encodeURIComponent(JSON.stringify(ctx.query.fields));
    const uri = encodeURIComponent(ctx.query.uri);
    const widgetUrl = `${config.host}/api/widget?type=${type}&fields=${fields}&uri=${uri}`;

    ctx.body = widgetUrl;
}

export async function setup(ctx, next) {
    ctx.getExporter = getExporter;
    ctx.exportFileMiddleware = exportFileMiddleware;
    ctx.exportWidgetMiddleware = exportWidgetMiddleware;
    await next();
}

export async function exportMiddleware(ctx, type) {
    try {
        ctx.keepDbOpened = true;

        const exporterConfig = ctx.getExporterConfig();

        const exportStreamFactory = ctx.getExporter(type);

        if (exportStreamFactory.type === 'file') {
            await ctx.exportFileMiddleware(ctx, type, exportStreamFactory, exporterConfig);
            return;
        }

        await ctx.exportWidgetMiddleware(ctx, type);
    } catch (error) {
        ctx.status = 500;
        ctx.body = error.message;
    }
}

export async function getExporters(ctx) {
    const configuredExporters = config.exporters || [];

    const availableExporters = configuredExporters.map((exporter) => {
        const exportStreamFactory = ctx.getExporter(exporter);

        return {
            name: exporter,
            type: exportStreamFactory.type,
        };
    });

    ctx.body = availableExporters;
}

const app = new Koa();

app.use(setup);
app.use(route.get('/', getExporters));
app.use(route.get('/:type', exportMiddleware));

export default app;
