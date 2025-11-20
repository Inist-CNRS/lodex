import { TaskStatus, type DataSource } from '@lodex/common';
import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import route from 'koa-route';
import { getEnrichmentDataPreview } from '../../services/enrichment/enrichment';
import { previewDataSourceSchema } from './dataSource.schema';

const app = new Koa();

export const listDataSource = async (ctx: ListDataSourceContext) => {
    const [precomputed, datasetColumns] = await Promise.all([
        ctx.precomputed.findAll(),
        ctx.dataset.getColumnsWithSubPaths(),
    ]);

    const precomputedWithColumns = await Promise.all(
        precomputed.map(
            async ({ _id, name, status, hasData }): Promise<DataSource> => {
                if (hasData === false) {
                    return {
                        id: _id.toString(),
                        name,
                        status,
                        columns: [],
                        isEmpty: true,
                    };
                }

                const columns =
                    await ctx.precomputed.getColumnsWithSubPaths(_id);

                return {
                    id: _id.toString(),
                    name,
                    status,
                    columns,
                    isEmpty: columns.length === 0,
                };
            },
        ),
    );

    ctx.body = [
        {
            id: 'dataset',
            name: 'dataset',
            columns: datasetColumns,
            status: datasetColumns.length > 0 ? TaskStatus.FINISHED : undefined,
            isEmpty: datasetColumns.length === 0,
        },
        ...precomputedWithColumns,
    ] satisfies DataSource[];
};

export type ListDataSourceContext = Pick<Koa.Context, 'body'> & {
    dataset: Pick<Koa.Context['dataset'], 'getColumnsWithSubPaths'>;
    precomputed: Pick<
        Koa.Context['precomputed'],
        'findAll' | 'getColumnsWithSubPaths'
    >;
};

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
