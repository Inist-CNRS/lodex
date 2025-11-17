import { TaskStatus, type DataSource } from '@lodex/common';
import Koa from 'koa';
import route from 'koa-route';

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

export const previewDataSource = async (
    ctx: PreviewDataSourceContext,
    id: string,
) => {
    if (id === 'dataset') {
        ctx.body = await ctx.dataset.getExcerpt();
        return;
    }

    ctx.body = await ctx.precomputed.getSample(id);
};

export type PreviewDataSourceContext = Pick<Koa.Context, 'body'> & {
    dataset: Pick<Koa.Context['dataset'], 'getExcerpt'>;
    precomputed: Pick<Koa.Context['precomputed'], 'getSample'>;
};

app.use(route.get('/', listDataSource));
app.use(route.get('/:id/preview', previewDataSource));

export default app;
