export default async (ctx) => {
    const publishedDatasetCount = await ctx.publishedDataset.count();
    const characteristics = await ctx.publishedCharacteristic.findAllVersions({}).toArray();
    const fields = await ctx.field.find({}).toArray();

    ctx.body = {
        characteristics,
        fields,
        published: publishedDatasetCount > 0,
    };
};
