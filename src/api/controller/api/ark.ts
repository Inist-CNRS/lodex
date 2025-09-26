// @ts-expect-error TS(2792): Cannot find module 'inist-ark'. Did you mean to se... Remove this comment to see the full error message
import InistArk from 'inist-ark';

const ARK_URI = new RegExp(/ark:\/(\d{5,})/, 'i');

export default async (ctx: any, next: any) => {
    const uri = ctx.path;
    if (
        !uri.startsWith('ark:/') &&
        !uri.startsWith('uid:/') &&
        !ctx.query.uri
    ) {
        await next();
        return;
    }

    const arkMatches = ARK_URI.exec(uri);

    if (ctx.query.uri) {
        ctx.body = await ctx.publishedDataset.findByUri(
            decodeURIComponent(ctx.query.uri),
        );
        return;
    }

    if (!arkMatches) {
        ctx.status = 404;
        return;
    }

    if (arkMatches) {
        const ark = new InistArk({
            naan: arkMatches[1],
        });

        const validation = ark.validate(uri);

        if (!validation.ark) {
            ctx.status = 404;
            return;
        }
    }

    ctx.body = await ctx.publishedDataset.findByUri(uri);
};

export const arkUriRouteHandler = async (ctx: any, identifier: any) => {
    ctx.body = await ctx.publishedDataset.findByUri(identifier);
};
