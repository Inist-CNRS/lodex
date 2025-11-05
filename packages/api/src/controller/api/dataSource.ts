import { TaskStatus, type DataSource } from '@lodex/common';
import Koa from 'koa';
import route from 'koa-route';

const app = new Koa();

const getColumnsFromSample = (
    sample?: Record<string, unknown>,
): DataSource['columns'] => {
    if (!sample) {
        return [];
    }

    return Object.keys(sample).map((name: string) => ({
        name,
        subPaths:
            sample[name] &&
            typeof sample[name] === 'object' &&
            !Array.isArray(sample[name])
                ? Object.keys(sample[name])
                : [],
    }));
};

export const listDataSource = async (ctx: ListDataSourceContext) => {
    const [precomputed, excerpt] = await Promise.all([
        ctx.precomputed.findAll(),
        ctx.dataset
            .getExcerpt()
            .then((rows: Record<string, unknown>[]) => rows.at(0)),
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

                const sample = await ctx.precomputed
                    .getSample(_id)
                    .then((rows) => rows.at(0));

                return {
                    id: _id.toString(),
                    name,
                    status,
                    columns: getColumnsFromSample(sample),
                    isEmpty: !sample,
                };
            },
        ),
    );

    ctx.body = [
        {
            id: 'dataset',
            name: 'dataset',
            columns: getColumnsFromSample(excerpt),
            status: excerpt ? TaskStatus.FINISHED : undefined,
            isEmpty: !excerpt,
        },
        ...precomputedWithColumns,
    ] satisfies DataSource[];
};

export type ListDataSourceContext = Pick<Koa.Context, 'body'> & {
    dataset: Pick<Koa.Context['dataset'], 'getExcerpt'>;
    precomputed: Pick<Koa.Context['precomputed'], 'findAll' | 'getSample'>;
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
