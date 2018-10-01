import InistArk from 'inist-ark';

import prefetchFormatData from '../../services/preFetchFormatData';

const ARK_URI = new RegExp(/ark:\/(\d{5,})/, 'i');

export const prepareArk = async (ctx, next) => {
    ctx.prefetchFormatData = prefetchFormatData;
    await next();
};

const getResource = async ctx => {
    const uri = ctx.path;
    if (
        !uri.startsWith('ark:/') &&
        !uri.startsWith('uid:/') &&
        !ctx.query.uri
    ) {
        return null;
    }

    const arkMatches = ARK_URI.exec(uri);

    if (ctx.query.uri) {
        return ctx.publishedDataset.findByUri(
            decodeURIComponent(ctx.query.uri),
        );
    }

    if (!arkMatches) {
        return null;
    }

    if (arkMatches) {
        const ark = new InistArk({
            naan: arkMatches[1],
        });

        const validation = ark.validate(uri);

        if (!validation.ark) {
            return null;
        }
    }

    return ctx.publishedDataset.findByUri(uri);
};

export default async ctx => {
    const resource = await getResource(ctx);

    if (!resource) {
        ctx.status = 404;
        return;
    }
    if (!ctx.query.applyFormat) {
        ctx.body = resource;
        return;
    }

    const fields = await ctx.field.findPrefetchResourceFields();

    if (!fields.length) {
        ctx.body = resource;
        return;
    }

    const prefetchedData = await ctx.prefetchFormatData(
        fields,
        resource.versions.slice(-1)[0],
    );

    ctx.body = {
        ...resource,
        prefetchedData,
    };
};
