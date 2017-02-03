import omit from 'lodash.omit';

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
    const getUri = ctx.getDocumentTransformer({ env: 'node', dataset: ctx.dataset }, [columns[uriIndex]]);
    const addUri = async doc => ({
        ...omit(doc, ['_id']),
        ...await getUri(doc),
    });

    await tranformAllDocument(
        count,
        ctx.dataset.findLimitFromSkip.bind(ctx.dataset),
        ctx.uriDataset.insertMany.bind(ctx.uriDataset),
        addUri,
    );

    const transformDocument = ctx
        .getDocumentTransformer({ env: 'node', dataset: ctx.uriDataset }, columns);

    const transformDocumentWithUri = async doc => ({
        ...await transformDocument(doc),
        uri: doc.uri,
    });

    await tranformAllDocument(
        count,
        ctx.uriDataset.findLimitFromSkip.bind(ctx.uriDataset),
        ctx.publishedDataset.insertMany.bind(ctx.publishedDataset),
        transformDocumentWithUri,
    );

    ctx.redirect('/api/publication');
};

export default async (ctx) => {
    ctx.getDocumentTransformer = getDocumentTransformer;
    await publishMiddleware(ctx);
};
