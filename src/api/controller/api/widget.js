import Koa from 'koa';
import route from 'koa-route';
import { getExporter, getExporterConfig } from './export';

const app = new Koa();

export async function renderWidget(ctx) {
    const { fields: requestedFields, type, uri } = ctx.request.query;
    const exporter = getExporter(decodeURIComponent(type));
    const config = getExporterConfig();

    if (uri) {
        const resource = await ctx.publishedDataset.findByUri(uri);
        const fields = await ctx.field.findAll();
        ctx.body = exporter(config, fields, [resource], JSON.parse(requestedFields));
    }
}

app.use(route.get('/', renderWidget));

export default app;
