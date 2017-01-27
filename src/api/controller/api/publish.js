/* eslint no-await-in-loop: off */
import getDocumentTransformer from '../../../common/getDocumentTransformer';

export const publishMiddleware = async (ctx) => {
    const count = await ctx.dataset.count({});
    let handled = 0;

    // TODO: remove this for stable state 2
    const firstLines = await ctx.dataset.findLimitFromSkip(1, 0);
    await ctx.field.insertMany(Object.keys(firstLines[0]).filter(k => k !== '_id').map(key => ({
        name: key,
        transformers: [],
    })));

    const columns = await ctx.field.findAll();

    const transformDocument = ctx.getDocumentTransformer(columns);

    while (handled < count) {
        const dataset = await ctx.dataset.findLimitFromSkip(100, handled);
        const transformedDataset = await Promise.all(dataset.map(transformDocument));
        await ctx.publishedDataset.insertMany(transformedDataset);
        handled += dataset.length;
    }

    ctx.redirect('/api/publication');
};

export default async (ctx) => {
    ctx.getDocumentTransformer = getDocumentTransformer;
    await publishMiddleware(ctx);
};
