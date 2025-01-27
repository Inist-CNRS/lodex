import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import getLogger from '../../services/logger';
import { createDiacriticSafeContainRegex } from '../../services/createDiacriticSafeContainRegex';
import { buildQuery } from './buildQuery';

const app = new Koa();

export const clearDataset = async (ctx) => {
    try {
        // get all collection names except `configTenant`
        const collectionNames = (
            await ctx.db.listCollections().toArray()
        ).filter((collection) => collection.name !== 'configTenant');

        if (collectionNames.length > 0) {
            await Promise.all(
                collectionNames.map((collection) =>
                    ctx.db.dropCollection(collection.name),
                ),
            );
        }
        ctx.body = { status: 'success' };
    } catch (error) {
        const logger = getLogger(ctx.tenant);
        logger.error(`Clear dataset error`, {
            error,
        });
        ctx.body = { status: 'error', error };
    }
};

export const getDatasetColumns = async (ctx) => {
    const columns = await ctx.dataset.getColumns();
    ctx.body = { columns };
};

export const getDataset = async (ctx) => {
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
    const datas = await ctx.dataset.findLimitFromSkip(
        limit ? parseInt(limit, 10) : 10,
        skip ? parseInt(skip) : 0,
        query,
        sortBy,
        sortDir?.toUpperCase(),
    );
    ctx.body = { count, datas };
};

export const updateDataset = async (ctx) => {
    const { uri, field, value } = ctx.request.body;
    const dataset = await ctx.dataset.findBy('uri', uri);
    if (!dataset) {
        ctx.body = { status: 'error', error: 'dataset not found' };
        ctx.status = 404;
        return;
    }
    await ctx.dataset.updateOne(
        {
            uri: uri,
        },
        { $set: { [field]: value } },
    );
    ctx.body = { status: 'success' };
};

export const deleteDatasetRow = async (ctx, id) => {
    try {
        await ctx.dataset.deleteOne(id);
        ctx.body = { status: 'deleted' };
    } catch (error) {
        const logger = getLogger(ctx.tenant);
        logger.error(`Delete dataset row error`, {
            error,
        });
        ctx.body = { status: 'error', error };
    }
};

app.use(route.delete('/', clearDataset));
app.use(route.get('/columns', getDatasetColumns));
app.use(route.get('/', getDataset));
app.use(route.delete('/:id', deleteDatasetRow));
app.use(koaBodyParser());
app.use(route.put('/', updateDataset));

export default app;
