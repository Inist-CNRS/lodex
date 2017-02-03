/* eslint no-await-in-loop: off */
import getDocumentTransformer from '../../../common/getDocumentTransformer';

export const tranformAllDocument = async (count, findLimitFromSkip, insertMany, transformer) => {
    let handled = 0;
    while (handled < count) {
        const dataset = await findLimitFromSkip(100, handled);
        const transformedDataset = await Promise.all(dataset.map(transformer));
        await insertMany(transformedDataset);
        handled += dataset.length;
    }
};

export const publishMiddleware = async (ctx) => {
    const count = await ctx.dataset.count({});

    const columns = await ctx.field.findAll();

    const uriIndex = columns.findIndex(col => col.name === 'uri');
    const addUri = ctx.getDocumentTransformer({ env: 'node', dataset: ctx.dataset }, columns[uriIndex]);

    await tranformAllDocument(
        count,
        ctx.dataset.findLimitFromSkip,
        ctx.uriDataset.insertMany,
        addUri,
    );

    const transformDocument = ctx
        .getDocumentTransformer({ env: 'node', dataset: ctx.dataset }, columns.splice(uriIndex));

    await tranformAllDocument(
        count,
        ctx.uriDataset.findLimitFromSkip,
        ctx.publishedDataset.insertMany,
        transformDocument,
    );

    ctx.redirect('/api/publication');
};

export default async (ctx) => {
    ctx.getDocumentTransformer = getDocumentTransformer;
    await publishMiddleware(ctx);
};
