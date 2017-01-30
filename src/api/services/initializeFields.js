import { URI_FIELD_NAME } from '../../common/uris';

export default async (ctx, next) => {
    const uriColumn = await ctx.field.findOne({ name: URI_FIELD_NAME });

    if (!uriColumn) {
        await ctx.field.insertOne({
            name: URI_FIELD_NAME,
            transformers: [],
        });
    }

    await next();
};
