import omit from 'lodash.omit';
import Koa from 'koa';
import route from 'koa-route';

/* eslint no-await-in-loop: off */
import getDocumentTransformer from '../../services/getDocumentTransformer';

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

export const versionTransformResult = transformDocument => async (doc, _, __, publicationDate = new Date()) => ({
    uri: doc.uri,
    versions: [{
        ...await transformDocument(doc),
        publicationDate,
    }],
});

export const publishCharacteristics = async (ctx, datasetCoverFields, count) => {
    if (!datasetCoverFields.length) {
        return;
    }
    const getPublishedCharacteristics = ctx
        .getDocumentTransformer(datasetCoverFields);

    const [lastResource] = await ctx.uriDataset.findLimitFromSkip(1, count - 1);
    const characteristics = await getPublishedCharacteristics(lastResource);

    const characteristicsKeys = Object.keys(characteristics);

    if (characteristicsKeys.length) {
        const publishedCharacteristics = characteristicsKeys
            .reduce((result, name) => ({
                ...result,
                [name]: characteristics[name],
            }), {});

        await ctx.publishedCharacteristic.addNewVersion(publishedCharacteristics);
    }
};

export const preparePublish = async (ctx, next) => {
    ctx.tranformAllDocuments = tranformAllDocuments;
    ctx.addTransformResultToDoc = addTransformResultToDoc;
    ctx.versionTransformResult = versionTransformResult;
    ctx.publishCharacteristics = publishCharacteristics;
    ctx.getDocumentTransformer = getDocumentTransformer(ctx);
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
    const getUri = ctx.getDocumentTransformer([uriCol]);
    const addUri = ctx.addTransformResultToDoc(getUri);

    await ctx.tranformAllDocuments(
        count,
        ctx.dataset.findLimitFromSkip,
        ctx.uriDataset.insertBatch,
        addUri,
    );

    const transformDocument = ctx
        .getDocumentTransformer(collectionCoverFields.filter(col => col.name !== 'uri'));

    const transformDocumentAndKeepUri = ctx.versionTransformResult(transformDocument);

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
