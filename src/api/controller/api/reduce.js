import Koa from 'koa';
import route from 'koa-route';
import reducers from '../../reducers/';

const findAndExpose = (result) => {
    if (Array.isArray(result)) {
        return result;
    }
    return result.find({}).toArray();
};

export const mapAndReduce = async (ctx, reducer) => {
    if (!reducers[reducer]) {
        throw new Error(`Unknown reducer '${reducer}'`);
    }
    const { map, reduce } = reducers[reducer];
    const field = ctx.request.query.field || 'uri';
    const fields = Array.isArray(field) ? field : [field];
    const options = {
        query: {},
        out: { inline: 1 },
//        out: { replace: 'replacethiscollection' },
        scope: {
            fields,
        },
    };
    const result = await ctx.publishedDataset.mapReduce(map, reduce, options);
    const data = await findAndExpose(result);
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
