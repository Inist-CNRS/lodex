import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import route from 'koa-route';
import getLogger from '../../services/logger';
import { buildQuery } from './buildQuery';
import { workerQueues } from '../../workers';
import { PUBLISHER } from '../../workers/publisher';
import { v1 as uuid } from 'uuid';

const app = new Koa();

export const clearDataset = async (ctx: any) => {
    try {
        // get all collection names except `configTenant`
        const collectionNames = (
            await ctx.db.listCollections().toArray()
        ).filter((collection: any) => collection.name !== 'configTenant');

        if (collectionNames.length > 0) {
            await Promise.all(
                collectionNames.map((collection: any) =>
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

export const getDatasetColumns = async (ctx: any) => {
    const columns = await ctx.dataset.getColumns();
    ctx.body = { columns };
};

export const getDataset = async (ctx: any) => {
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

export const updateDataset = async (ctx: any) => {
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

export const deleteManyDatasetRowByIds = async (ctx: any) => {
    const ids = ctx.request.query.ids && ctx.request.query.ids.split(',');
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        ctx.status = 400;
        ctx.body = { status: 'error', error: 'ids parameter is missing' };
        return;
    }
    try {
        const { acknowledged, deletedCount } =
            await ctx.dataset.deleteManyById(ids);

        if (!acknowledged || deletedCount === 0) {
            ctx.status = 404;
            ctx.body = { status: 'error', error: `Could not delete Ids` };
            return;
        }

        if ((await ctx.publishedDataset.countAll()) > 0) {
            await workerQueues[ctx.tenant].add(
                PUBLISHER, // Name of the job
                { jobType: PUBLISHER, tenant: ctx.tenant },
                { jobId: uuid() },
            );
        }

        ctx.body = { status: 'deleted' };
    } catch (error) {
        const logger = getLogger(ctx.tenant);
        logger.error(`Delete dataset rows error`, {
            error,
        });
        ctx.body = { status: 'error', error };
    }
};

export const deleteManyDatasetRowByFilter = async (ctx: any) => {
    const { filterBy, filterOperator, filterValue } = ctx.request.query;
    if (!filterBy || !filterOperator || !filterValue) {
        ctx.status = 400;
        ctx.body = { status: 'error', error: 'filter parameter is incomplete' };
        return;
    }
    try {
        const query = buildQuery(filterBy, filterOperator, filterValue);
        const { acknowledged, deletedCount } =
            await ctx.dataset.deleteMany(query);

        if (!acknowledged || deletedCount === 0) {
            ctx.status = 404;
            ctx.body = { status: 'error', error: `Could not delete Ids` };
            return;
        }

        if ((await ctx.publishedDataset.countAll()) > 0) {
            await workerQueues[ctx.tenant].add(
                PUBLISHER, // Name of the job
                { jobType: PUBLISHER, tenant: ctx.tenant },
                { jobId: uuid() },
            );
        }

        ctx.body = { status: 'deleted' };
    } catch (error) {
        const logger = getLogger(ctx.tenant);
        logger.error(`Delete dataset rows error`, {
            error,
        });
        ctx.body = { status: 'error', error };
    }
};

app.use(route.delete('/', clearDataset));
app.use(route.get('/columns', getDatasetColumns));
app.use(route.get('/', getDataset));
app.use(route.delete('/batch-delete-id', deleteManyDatasetRowByIds));
app.use(route.delete('/batch-delete-filter', deleteManyDatasetRowByFilter));
app.use(koaBodyParser());
app.use(route.put('/', updateDataset));

export default app;
