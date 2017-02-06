import omit from 'lodash.omit';
import Koa from 'koa';
import route from 'koa-route';

/* eslint no-await-in-loop: off */
import getDocumentTransformer from '../../../common/getDocumentTransformer';

const app = new Koa();

export const tranformAllDocuments = async (count, findLimitFromSkip, insertBatch, transformer) => {
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

export const preparePublish = async (ctx, next) => {
    ctx.tranformAllDocuments = tranformAllDocuments;
    ctx.getDocumentTransformer = getDocumentTransformer;
    ctx.addTransformResultToDoc = addTransformResultToDoc;
    ctx.addUriToTransformResult = addUriToTransformResult;
    await next();
};

export const handlePublishError = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        await ctx.uriDataset.remove({});
        await ctx.publishedDataset.remove({});
        throw error;
    }
};

export const doPublish = async (ctx) => {
    const count = await ctx.dataset.count({});

    const columns = await ctx.field.findAll();

    const uriCol = columns.find(col => col.name === 'uri');
    const getUri = ctx.getDocumentTransformer({ env: 'node', dataset: ctx.dataset }, [uriCol]);
    const addUri = ctx.addTransformResultToDoc(getUri);

    await ctx.tranformAllDocuments(
        count,
        ctx.dataset.findLimitFromSkip,
        ctx.uriDataset.insertBatch,
        addUri,
    );

    const transformDocument = ctx
        .getDocumentTransformer({
            env: 'node',
            dataset: ctx.uriDataset,
        }, columns.filter(col => col.name !== 'uri'));

    const transformDocumentAndKeepUri = ctx.addUriToTransformResult(transformDocument);

    await ctx.tranformAllDocuments(
        count,
        ctx.uriDataset.findLimitFromSkip,
        ctx.publishedDataset.insertBatch,
        transformDocumentAndKeepUri,
    );

    ctx.redirect('/api/publication');
};

app.use(route.post('/', preparePublish));
app.use(route.post('/', handlePublishError));

app.use(route.post('/', doPublish));

export default app;
