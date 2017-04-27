import Koa from 'koa';
import route from 'koa-route';
import { getExporter, getExporterConfig } from './export';
import jsonConfig from '../../../../config.json';

const app = new Koa();

export async function renderWidget(ctx) {
    const { fields: requestedFields, type, uri, page = 0, perPage = jsonConfig.perPage || 10 } = ctx.request.query;
    const exporter = getExporter(decodeURIComponent(type));
    const config = getExporterConfig();

    const fields = await ctx.field.findAll();
    if (uri) {
        const resource = await ctx.publishedDataset.findByUri(uri);
        ctx.body = exporter(config, fields, resource, JSON.parse(requestedFields));
        return;
    }

    const resources = await ctx.publishedDataset.findPage(page, perPage);

    ctx.body = exporter(
        config,
        fields,
        resources.data,
        JSON.parse(requestedFields),
        parseInt(page, 10),
        perPage,
        resources.total,
    );
}

app.use(route.get('/', renderWidget));

export default app;
