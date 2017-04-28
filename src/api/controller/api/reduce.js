import Koa from 'koa';
import route from 'koa-route';
import reducers from '../../reducers/';

const findAndExpose = (result) => {
    if (Array.isArray(result)) {
        return result;
    }
    return result.find({}).toArray();
};

export const askingWithReducer = async (ctx, reducer) => {
    if (!reducers[reducer]) {
        throw new Error(`Unknown reducer '${reducer}'`);
    }
    const { map, reduce } = reducers[reducer];
    const fields = ctx.request.query.fields || 'uri';
    const exp = Array.isArray(fields) ? fields : [fields];
    const options = {
        query: {},
        out: { inline: 1 },
//        out: { replace: 'replacethiscollection' },
        scope: {
            exp: exp,
        },
    };
    const result = await ctx.publishedDataset.mapReduce(map, reduce, options);
    const data = await findAndExpose(result);
    console.log('exp', options.scope.exp);

    if (data && data[0]) {
        ctx.body = {
            data: data[0],
            total: data[0].value.length,
        };
    } else {
        ctx.body = {
            data: {},
            total: 0,
        };
    }
};

const app = new Koa();

app.use(route.get('/:reducer', askingWithReducer));

export default app;
