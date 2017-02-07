import omit from 'lodash.omit';
import Koa from 'koa';
import route from 'koa-route';
import pickBy from 'lodash.pickby';

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

export const publishCharacteristics = async (ctx, datasetCoverFields, count) => {
    if (!datasetCoverFields.length) {
        return;
    }
    const getPublishedCharacteristics = ctx
        .getDocumentTransformer({
            env: 'node',
            dataset: ctx.uriDataset,
        }, datasetCoverFields);
    const [lastRessource] = await ctx.uriDataset.findLimitFromSkip(1, count - 1);
    const characteristics = await getPublishedCharacteristics(lastRessource);

    const publishedCharacteristics = Object.keys(characteristics)
        .map(name => ({
            name,
            value: characteristics[name],
        }));

    if (publishedCharacteristics.length) {
        await ctx.publishedCharacteristic.insertMany(publishedCharacteristics);
    }
};

export const preparePublish = async (ctx, next) => {
    ctx.tranformAllDocuments = tranformAllDocuments;
    ctx.getDocumentTransformer = getDocumentTransformer;
    ctx.addTransformResultToDoc = addTransformResultToDoc;
    ctx.addUriToTransformResult = addUriToTransformResult;
    ctx.publishCharacteristics = publishCharacteristics;
    await next();
};

export const handlePublishError = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        await ctx.uriDataset.remove({});
        await ctx.publishedDataset.remove({});
        await ctx.publishedCharacteristic.remove({});
        throw error;
    }
};

export const doPublish = async (ctx) => {
    const count = await ctx.dataset.count({});

    const fields = await ctx.field.findAll();
    const collectionCoverFields = fields.filter(c => c.cover === 'collection');
    const datasetCoverFields = fields.filter(c => c.cover === 'dataset');

    const uriCol = fields.find(col => col.name === 'uri');
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
        }, collectionCoverFields.filter(col => col.name !== 'uri'));

    const transformDocumentAndKeepUri = ctx.addUriToTransformResult(transformDocument);

    await ctx.tranformAllDocuments(
        count,
        ctx.uriDataset.findLimitFromSkip,
        ctx.publishedDataset.insertBatch,
        transformDocumentAndKeepUri,
    );
    await ctx.publishCharacteristics(ctx, datasetCoverFields, count);

    ctx.redirect('/api/publication');
};

app.use(route.post('/', preparePublish));
app.use(route.post('/', handlePublishError));

app.use(route.post('/', doPublish));

export default app;
