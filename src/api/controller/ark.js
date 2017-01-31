import Koa from 'koa';
import route from 'koa-route';
import InistArk from 'inist-ark';

import mongoClient from '../services/mongoClient';

const app = new Koa();
const ARK_URI = new RegExp(/ark:\/(\d{5,})/, 'i');

export const getFromArkUri = async (ctx, next) => {
    const uri = ctx.path;
    const matches = ARK_URI.exec(uri);

    if (!uri.startsWith('ark:/') && !ctx.query.uri) {
        await next();
        return;
    }

    if (ctx.query.uri) {
        ctx.body = await ctx.publishedDataset.findOne({ uri: ctx.query.uri });
        return;
    }

    if (!matches) {
        ctx.status = 404;
        return;
    }

    const ark = new InistArk({
        naan: matches[1],
    });

    const validation = ark.validate(uri);

    if (!validation.ark) {
        ctx.status = 404;
        return;
    }

    ctx.body = await ctx.publishedDataset.findOne({ uri });
};

export const arkUriRouteHandler = async (ctx, identifier) => {
    ctx.body = await ctx.publishedDataset.findOne({ uri: identifier });
};

app.use(mongoClient);
app.use(route.get('/', getFromArkUri));

export default app;

