import InistArk from 'inist-ark';

const ARK_URI = new RegExp(/ark:\/(\d{5,})/, 'i');

export default async (ctx, next) => {
    const uri = ctx.path;
    const matches = ARK_URI.exec(uri);

    if (!uri.startsWith('ark:/') && !ctx.query.uri) {
        await next();
        return;
    }

    if (ctx.query.uri) {
        ctx.body = await ctx.publishedDataset.findByUri(ctx.query.uri);
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

    ctx.body = await ctx.publishedDataset.findByUri(uri);
};

export const arkUriRouteHandler = async (ctx, identifier) => {
    ctx.body = await ctx.publishedDataset.findByUri(identifier);
};
