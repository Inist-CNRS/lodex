export default async (ctx) => {
    const publishedDatasetCount = await ctx.publishedDataset.count();
    const characteristics = await ctx.publishedCharacteristic.findAllVersions({});
    const fields = await ctx.field.findAll();

    ctx.body = {
        characteristics,
        fields,
        published: publishedDatasetCount > 0,
    };
};
