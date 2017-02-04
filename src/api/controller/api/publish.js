import omit from 'lodash.omit';
import Koa from 'koa';

/* eslint no-await-in-loop: off */
import getDocumentTransformer from '../../../common/getDocumentTransformer';

const app = new Koa();

export const tranformAllDocument = async (count, findLimitFromSkip, insertBatch, transformer) => {
    let handled = 0;
    while (handled < count) {
        const dataset = await findLimitFromSkip(100, handled);
        const transformedDataset = await Promise.all(dataset.map(transformer));
        await insertBatch(transformedDataset);
        handled += dataset.length;
    }
};

export const addTransformResultToDoc = transform => async doc => ({
    ...omit(doc, ['_id']),
    ...await transform(doc),
});

export const addUriToTransformResult = transformDocument => async doc => ({
    ...await transformDocument(doc),
    uri: doc.uri,
});

export const doPublish = async (ctx) => {
    const count = await ctx.dataset.count({});

    const columns = await ctx.field.findAll();

    const uriIndex = columns.findIndex(col => col.name === 'uri');
    const getUri = ctx.getDocumentTransformer({ env: 'node', dataset: ctx.dataset }, [columns[uriIndex]]);
    const addUri = ctx.addTransformResultToDoc(getUri);

    await ctx.tranformAllDocument(
        count,
        ctx.dataset.findLimitFromSkip,
        ctx.uriDataset.insertBatch,
        addUri,
    );

    const transformDocument = ctx
        .getDocumentTransformer({
            env: 'node',
            dataset: ctx.uriDataset,
        }, columns.filter((_, index) => index !== uriIndex));

    const transformDocumentAndKeepUri = ctx.addUriToTransformResult(transformDocument);

    await ctx.tranformAllDocument(
        count,
        ctx.uriDataset.findLimitFromSkip,
        ctx.publishedDataset.insertBatch,
        transformDocumentAndKeepUri,
    );

    ctx.redirect('/api/publication');
};

export const tryPublish = async (ctx, next) => {
    ctx.tranformAllDocument = tranformAllDocument;
    ctx.getDocumentTransformer = getDocumentTransformer;
    ctx.addTransformResultToDoc = addTransformResultToDoc;
    ctx.addUriToTransformResult = addUriToTransformResult;
    try {
        await next();
    } catch (error) {
        await ctx.uriDataset.remove({});
        await ctx.publishedDataset.remove({});
        throw error;
    }
};

app.use(tryPublish);

app.use(doPublish);

export default app;
