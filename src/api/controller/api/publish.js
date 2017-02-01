/* eslint no-await-in-loop: off */
import getDocumentTransformer from '../../../common/getDocumentTransformer';

export const publishMiddleware = async (ctx) => {
    const count = await ctx.dataset.count({});

    // TODO: remove this for stable state 2
    const firstLines = await ctx.dataset.findLimitFromSkip(1, 0);
    await ctx.field.insertMany(Object.keys(firstLines[0]).filter(k => k !== '_id').map(key => ({
        name: key,
        transformers: [],
    })));

    const columns = await ctx.field.findAll();

    const transformDocumentFactory = ctx.getDocumentTransformer({
        getDocumentByField: ctx.publishedDataset.findOneByField,
        naan: ctx.ezMasterConfig.naan,
        subpublisher: ctx.ezMasterConfig.subpublisher,
    })(columns);

    const transformDocumentPreStage = transformDocumentFactory('pre');
    let handled = 0;
    while (handled < count) {
        const dataset = await ctx.dataset.findLimitFromSkip(100, handled);
        const transformedDataset = await Promise.all(dataset.map(transformDocumentPreStage));
        await ctx.publishedDataset.insertMany(transformedDataset);
        handled += dataset.length;
    }

    const transformDocumentPostStage = transformDocumentFactory('post');
    handled = 0;

    while (handled < count) {
        const dataset = await ctx.publishedDataset.findLimitFromSkip(100, handled);
        const transformedDataset = await Promise.all(dataset.map(transformDocumentPostStage));
        await Promise.all(transformedDataset.map(({ _id, ...doc }) => ctx.publishedDataset.updateOne({ _id }, doc)));

        handled += dataset.length;
    }

    ctx.redirect('/api/publication');
};

export default async (ctx) => {
    ctx.getDocumentTransformer = getDocumentTransformer;
    await publishMiddleware(ctx);
};
