import Koa from 'koa';
import route from 'koa-route';
import hasher from 'node-object-hash';
import reducers from '../../reducers/';

const hashCoerce = hasher({ sort: false, coerce: true });

const findAndExpose = (result, limit, skip, sortBy, sortDir) => {
    if (Array.isArray(result)) {
        return result;
    }
    const by = sortBy === 'value' ? 'value' : '_id';
    const dir = sortDir === 'asc' ? 1 : -1;
    const sort = {};
    sort[by] = dir;


    console.log('findAndExpose', limit, skip, sort);

    return result
        .find({})
        .skip(Number(skip))
        .limit(Number(limit))
        .sort(sort)
        .toArray();
};

export const mapAndReduce = async (ctx, reducer) => {
    if (!reducers[reducer]) {
        throw new Error(`Unknown reducer '${reducer}'`);
    }
    const { map, reduce, finalize } = reducers[reducer];
    const { page = 0, perPage = 10, sortBy = 'value', sortDir, field = 'uri' } = ctx.request.query;
    const fields = Array.isArray(field) ? field : [field];
    const collName = String('mp_').concat(hashCoerce.hash({ reducer, fields }));
    const options = {
        query: {},
        finalize,
        out: {
            replace: collName,
        },
        scope: {
            fields,
        },
    };
    const collections = await ctx.db.listCollections().toArray();
    let result;
    if (collections.map(c => c.name).indexOf(collName) === -1) {
        result = await ctx.publishedDataset.mapReduce(map, reduce, options);
    } else {
        result = await ctx.db.collection(collName);
    }
    const data = await findAndExpose(result, perPage, page * perPage, sortBy, sortDir);
    if (data && data[0]) {
        ctx.body = {
            data,
            total: data.length,
        };
    } else {
        ctx.body = {
            data: [],
            total: 0,
        };
    }
};

const app = new Koa();

app.use(route.get('/:reducer', mapAndReduce));

export default app;
