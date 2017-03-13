import { URI_FIELD_NAME } from '../../common/uris';
import { COVER_COLLECTION } from '../../common/cover';

export default async (ctx, next) => {
    const uriColumn = await ctx.field.findOne({ name: URI_FIELD_NAME });

    if (!uriColumn) {
        await ctx.field.insertOne({
            cover: COVER_COLLECTION,
            label: URI_FIELD_NAME,
            name: URI_FIELD_NAME,
            display_on_list: true,
            transformers: [],
        });
    }

    await next();
};
