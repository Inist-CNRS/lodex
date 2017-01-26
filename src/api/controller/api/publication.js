export default async (ctx) => {
    const publishedDatasetCount = await ctx.publishedDataset.count();
    const fields = await ctx.field.find({}).toArray();

    ctx.body = {
        published: publishedDatasetCount > 0,
        model: fields,
    };
};
