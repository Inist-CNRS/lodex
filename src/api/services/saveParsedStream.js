const saveParsedStreamFactory = ctx =>
    async function saveParsedStream(parsedStream) {
        const publishedCount = await ctx.publishedDataset.count();
        if (publishedCount === 0) {
            await ctx.dataset.remove({});
            await ctx.saveStream(parsedStream);
            await ctx.field.initializeModel();

            return ctx.dataset.count();
        }
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

            const fields = await ctx.field.findAll();
            const collectionCoverFields = fields.filter(
                c => c.cover === 'collection',
            );

            const count = await ctx.dataset.count({
                lodex_published: { $exists: false },
            });

            await ctx.publishDocuments(ctx, count, collectionCoverFields);
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
