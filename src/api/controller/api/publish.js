/* eslint no-await-in-loop: off */
import getDocumentTransformer from '../../../common/getDocumentTransformer';

export const publishMiddleware = async (ctx) => {
    const count = await ctx.dataset.count({});
    let handled = 0;

    const columns = await ctx.field.findAll();

    const transformDocument = ctx.getDocumentTransformer(columns, ctx.ezMasterConfig);

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
