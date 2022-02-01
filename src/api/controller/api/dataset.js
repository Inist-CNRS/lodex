import Koa from 'koa';
import route from 'koa-route';
import logger from '../../services/logger';

const app = new Koa();

export const clearDataset = async ctx => {
    try {
        await ctx.publishedDataset.remove({});
        await ctx.publishedCharacteristic.remove({});
        await ctx.publishedFacet.remove({});
        await ctx.field.remove({});
        await ctx.dataset.remove({});
        await ctx.subresource.remove({});
        await ctx.enrichment.remove({});

        ctx.body = { status: 'success' };
    } catch (error) {
        logger.error('clear dataset error', {
            error,
        });
        ctx.body = { status: 'error', error };
    }
};
const buildQuery = (filterBy, filterOperator, filterValue) => {
    if (!filterValue) {
        return {};
    }
    switch (filterOperator) {
        case 'is':
            return { [filterBy]: { $eq: filterValue === 'true' } };
        case '=':
            return { [filterBy]: { $eq: parseFloat(filterValue) } };
        case '>':
            return { [filterBy]: { $gt: parseFloat(filterValue) } };
        case '<':
            return { [filterBy]: { $lt: parseFloat(filterValue) } };
        default:
            return { [filterBy]: new RegExp(`.*${filterValue}.*`) };
    }
};

export const getDatasetColumns = async ctx => {
    const columns = await ctx.dataset.getColumns();
    ctx.body = { columns };
};

export const getDataset = async ctx => {
    const {
        skip,
        limit,
        sortBy,
        sortDir,
        filterBy,
        filterOperator,
        filterValue,
    } = ctx.query;
    const query = buildQuery(filterBy, filterOperator, filterValue);
    const count = await ctx.dataset.find(query).count();
    const columns = await ctx.dataset.getColumns();
    const datas = await ctx.dataset.findLimitFromSkip(
        limit ? parseInt(limit, 10) : 10,
        skip ? parseInt(skip) : 0,
        query,
        sortBy,
        sortDir?.toUpperCase(),
    );
    ctx.body = { count, datas, columns };
};

app.use(route.delete('/', clearDataset));
app.use(route.get('/columns', getDatasetColumns));
app.use(route.get('/', getDataset));

export default app;
