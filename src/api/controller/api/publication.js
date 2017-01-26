export default async (ctx) => {
    const publishedDatasetCount = await ctx.publishedDataset.count();
    const publishedModel = await ctx.publishedModel.find({}).toArray();

    ctx.body = {
        published: publishedDatasetCount > 0,
        model: publishedModel,
    };
};
