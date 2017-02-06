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

    const fields = await ctx.field.findAll();
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
        }, fields.filter(col => col.name !== 'uri'));

    const transformDocumentAndKeepUri = ctx.addUriToTransformResult(transformDocument);

    await ctx.tranformAllDocuments(
        count,
        ctx.uriDataset.findLimitFromSkip,
        ctx.publishedDataset.insertBatch,
        transformDocumentAndKeepUri,
    );

    const [lastRessource] = await ctx.publishedDataset.findLimitFromSkip(1, count - 1);
    const isPublishedCharacteristic = (value, key) => datasetCoverFields.some(({ name }) => key === name);
    const publishedCharacteristics = pickBy(lastRessource, isPublishedCharacteristic);
    const publishedCharacteristicsKeys = Object.keys(publishedCharacteristics);

    if (publishedCharacteristicsKeys.length) {
        await ctx.publishedCharacteristic.insertMany(publishedCharacteristicsKeys.map(key => ({
            name: key,
            value: publishedCharacteristics[key],
        })));
    }

    ctx.redirect('/api/publication');
};

app.use(route.post('/', preparePublish));
app.use(route.post('/', handlePublishError));

app.use(route.post('/', doPublish));

export default app;
