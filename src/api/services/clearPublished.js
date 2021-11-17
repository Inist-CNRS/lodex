
export default async (ctx) => {
    await ctx.dataset.updateMany(
            {},
            { $unset: { lodex_published: '' } },
            { multi: true },
        );
    await ctx.publishedDataset.remove({});
    await ctx.publishedCharacteristic.remove({});
    await ctx.publishedFacet.remove({});
}
