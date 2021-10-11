import { SCOPE_COLLECTION, SCOPE_DOCUMENT } from '../../common/scope';

const saveParsedStreamFactory = ctx =>
    async function saveParsedStream(parsedStream, postSaveCallback = null) {
        const publishedCount = await ctx.publishedDataset.count();

        if (publishedCount === 0) {
            await ctx.saveStream(parsedStream);
            await ctx.field.initializeModel();

            if (typeof postSaveCallback === 'function') {
                await postSaveCallback();
            }

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

            await ctx.saveStream(parsedStream);

            if (typeof postSaveCallback === 'function') {
                await postSaveCallback();
            }

            const fields = await ctx.field.findAll();
            const collectionScopeFields = fields.filter(c =>
                [SCOPE_COLLECTION, SCOPE_DOCUMENT].includes(c.scope),
            );

            const count = await ctx.dataset.count({
                lodex_published: { $exists: false },
            });

            await ctx.publishDocuments(ctx, count, collectionScopeFields);
            await ctx.publishFacets(ctx, fields, false);

            return ctx.dataset.count();
        } catch (error) {
            await ctx.dataset.remove({ lodex_published: { $exists: false } });
            await ctx.publishedDataset.remove({
                lodex_published: { $exists: false },
            });

            throw error;
        }
    };

export default saveParsedStreamFactory;
