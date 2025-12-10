import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import route from 'koa-route';
import { getEnrichmentDataPreview } from '../../services/enrichment/enrichment';
import { previewDataSourceSchema } from './dataSource.schema';

const app = new Koa();

export const listDataSource = async (ctx: ListDataSourceContext) => {
    ctx.body = await ctx.dataSource.getDataSources();
};

export type ListDataSourceContext = Pick<Koa.Context, 'body' | 'dataSource'>;

export const previewDataSource = async (ctx: PreviewDataSourceContext) => {
    const previewDataSourceConfig = previewDataSourceSchema.safeParse(
        ctx.request.body,
    );

    if (!previewDataSourceConfig.success) {
        ctx.status = 400;
        ctx.body = { error: 'invalid_request' };
        return;
    }

    const { dataSource } = previewDataSourceConfig.data;

    if (
        !('rule' in previewDataSourceConfig.data) &&
        !('sourceColumn' in previewDataSourceConfig.data)
    ) {
        ctx.body =
            dataSource === 'dataset'
                ? await ctx.dataset.getExcerpt()
                : await ctx.precomputed.getSample(dataSource);
        return;
    }

    try {
        const previewData = await getEnrichmentDataPreview(ctx);
        ctx.body = previewData;
    } catch (e) {
        ctx.status = 500;
        ctx.body = { error: 'internal_error' };
    }
};

export type PreviewDataSourceContext = Pick<
    Koa.Context,
    'request' | 'body' | 'status'
> & {
    dataset: Pick<Koa.Context['dataset'], 'getExcerpt'>;
    precomputed: Pick<Koa.Context['precomputed'], 'getSample'>;
};

app.use(route.get('/', listDataSource));
app.use(koaBodyParser());
app.use(route.post('/preview', previewDataSource));

export default app;
