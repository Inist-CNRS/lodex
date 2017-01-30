import { URI_FIELD_NAME } from '../../common/uris';

let initialized = false;

export default async (ctx, next) => {
    if (!initialized) {
        initialized = true;
        const uriColumn = await ctx.field.findOne({ name: URI_FIELD_NAME });

        if (!uriColumn) {
            await ctx.field.insertOne({ name: URI_FIELD_NAME });
        }
    }

    await next();
};
