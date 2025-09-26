// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { SCOPE_COLLECTION, SCOPE_DOCUMENT } from '../../common/scope';

export const saveParsedStream = async (ctx: any, parsedStream: any) => {
    const publishedCount = await ctx.publishedDataset.count();

    if (publishedCount === 0) {
        await ctx.saveStream(parsedStream, ctx);
        await ctx.field.initializeModel();

        return ctx.dataset.count();
    }

    // When dataset is already published
    // Next imports will "auto-publish" automatically
    try {
        await ctx.dataset.updateMany(
            {},
            { $set: { lodex_published: true } },
            { multi: true },
        );

        await ctx.publishedDataset.updateMany(
            {},
            { $set: { lodex_published: true } },
            { multi: true },
        );

        await ctx.saveStream(parsedStream, ctx);

        const fields = await ctx.field.findAll();
        const collectionScopeFields = fields.filter((c: any) =>
            [SCOPE_COLLECTION, SCOPE_DOCUMENT].includes(c.scope),
        );

        const count = await ctx.dataset.count({
            lodex_published: { $exists: false },
        });

        await ctx.publishDocuments(ctx, count, collectionScopeFields);
        await ctx.publishFacets(ctx, fields, false);

        return ctx.dataset.count();
    } catch (error) {
        await ctx.dataset.deleteOne({ lodex_published: { $exists: false } });
        await ctx.publishedDataset.deleteOne({
            lodex_published: { $exists: false },
        });

        throw error;
    }
};
