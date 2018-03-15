const saveParsedStreamFactory = ctx =>
    async function saveParsedStream(parsedStream) {
        try {
            const publishedCount = await ctx.publishedDataset.count();
            if (publishedCount === 0) {
                await ctx.dataset.remove({});
                await ctx.saveStream(parsedStream);
                await ctx.field.initializeModel();
                return ctx.dataset.count();
            }
            await ctx.dataset.updateMany(
                {},
                { $set: { lodex_published: true } },
                { multi: true },
            );
            await ctx.uriDataset.updateMany(
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
            await ctx.publishFacets(ctx, fields);

            return ctx.dataset.count();
        } catch (error) {
            await ctx.dataset.remove({ lodex_published: { $exists: false } });
            await ctx.uriDataset.remove({
                lodex_published: { $exists: false },
            });
            await ctx.publishedDataset.remove({
                lodex_published: { $exists: false },
            });

            ctx.throw(500, error.message);
        }
    };

export default saveParsedStreamFactory;
