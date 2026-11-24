import { SCOPE_COLLECTION, SCOPE_DOCUMENT } from '@lodex/common';

export const saveParsedStream = async (ctx: any, parsedStream: any) => {
    const publishedCount = await ctx.publishedDataset.count();

    if (publishedCount === 0) {
        await ctx.saveStream(parsedStream, ctx);
        await ctx.field.initializeModel();

        return ctx.dataset.count();
    }

    await ctx.saveStream(parsedStream, ctx);

    // The import of a site generation does not publish: the generation
    // publishes at its end, once its enrichments are done. Its rows wait,
    // unmarked, for that publication or the next one.
    if (ctx.job?.data?.siteGenerationRunId) {
        return ctx.dataset.count();
    }

    // When dataset is already published
    // Next imports will "auto-publish" automatically: every row not
    // published yet, the ones an earlier import left waiting included.
    // publishDocuments marks them once they are published.
    const fields = await ctx.field.findAll();
    const collectionScopeFields = fields.filter((c: any) =>
        [SCOPE_COLLECTION, SCOPE_DOCUMENT].includes(c.scope),
    );

    const count = await ctx.dataset.count({
        _lodexPublished: { $ne: true },
    });

    await ctx.publishDocuments(ctx, count, collectionScopeFields);
    await ctx.publishFacets(ctx, fields, false);

    return ctx.dataset.count();
};
