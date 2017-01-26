/* eslint no-await-in-loop: off */
import getDocumentTransformer from '../../../common/getDocumentTransformer';

export default async (ctx) => {
    const count = await ctx.dataset.count({});
    let handled = 0;

    const publishedModel = await ctx.publishedModel.find({}).toArray();
    const transformDocument = getDocumentTransformer(publishedModel);

    while (handled < count) {
        const dataset = await ctx.dataset.find({}).skip(handled).limit(100).toArray();
        const transformedDataset = await Promise.all(dataset.map(transformDocument));
        await ctx.publishedDataset.insertMany(transformedDataset);
        handled += dataset.length;
    }

    ctx.redirect('/api/publication');
};
