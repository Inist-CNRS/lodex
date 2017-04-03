import Koa from 'koa';
import route from 'koa-route';
import asyncBusboy from 'async-busboy';

import config from '../../../../config.json';
import loaders from '../../loaders';
import saveStream from '../../services/saveStream';

export const getParser = (type) => {
    if (!loaders[type]) {
        throw new Error(`Unsupported document type: ${type}`);
    }

    return loaders[type](config.loader[type]);
};

export const requestToStream = asyncBusboyImpl => async (req) => {
    const { files } = await asyncBusboyImpl(req);
    return files[0];
};

export const clearUpload = async (ctx) => {
    await ctx.dataset.remove({});
    ctx.body = true;
};

export async function uploadMiddleware(ctx, type) {
    try {
        const parseStream = ctx.getParser(type);
        const requestStream = await ctx.requestToStream(ctx.req);
        const parsedStream = await parseStream(requestStream);

        await ctx.saveStream(parsedStream, ctx.dataset.insertMany.bind(ctx.dataset));
        await ctx.field.initializeModel();

        ctx.status = 200;
        ctx.body = {
            totalLines: await ctx.dataset.count(),
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = error.message;
    }
}

export const prepareUpload = async (ctx, next) => {
    ctx.getParser = getParser;
    ctx.requestToStream = requestToStream(asyncBusboy);
    ctx.saveStream = saveStream;

    await next();
};

const app = new Koa();

app.use(prepareUpload);

app.use(route.post('/:type', uploadMiddleware));
app.use(route.del('/clear', clearUpload));

export default app;
