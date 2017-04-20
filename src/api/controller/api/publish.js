import omit from 'lodash.omit';
import Koa from 'koa';
import route from 'koa-route';
import get from 'lodash.get';

/* eslint no-await-in-loop: off */
import getDocumentTransformer from '../../services/getDocumentTransformer';

const app = new Koa();

export const tranformAllDocuments = async (count, findLimitFromSkip, insertBatch, transformer) => {
    let handled = 0;
    while (handled < count) {
        const dataset = await findLimitFromSkip(1000, handled);
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

export const publishFacets = async (ctx, facetFields) =>
    Promise.all(facetFields.map(field =>
        ctx.publishedDataset
            .findDistinctValuesForField(field.name)
            .then(values => Promise.all(values.map(value =>
                ctx.publishedDataset
                    .countByFacet(field.name, value)
                    .then(count => ({ value, count })))))
            .then(values => ctx.publishedFacet.insertFacet(field.name, values)),
    ));

export const preparePublish = async (ctx, next) => {
    ctx.tranformAllDocuments = tranformAllDocuments;
    ctx.addTransformResultToDoc = addTransformResultToDoc;
    ctx.versionTransformResult = versionTransformResult;
    ctx.publishCharacteristics = publishCharacteristics;
    ctx.publishFacets = publishFacets;
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
    const facetFields = fields.filter(c => c.isFacet);

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

    const countUnique = (await ctx.uriDataset.distinct('uri')).length;
    await ctx.tranformAllDocuments(
        countUnique,
        ctx.uriDataset.findLimitFromSkip,
        ctx.publishedDataset.insertBatch,
        transformDocumentAndKeepUri,
    );
    await ctx.publishCharacteristics(ctx, datasetCoverFields, count);
    await ctx.publishFacets(ctx, facetFields);

    ctx.redirect('/api/publication');
};

export const verifyUri = async (ctx) => {
    const uriField = await ctx.field.findOneByName('uri');
    if (get(uriField, 'transformers[0].operation') === 'AUTOGENERATE_URI') {
        ctx.body = { valid: true };
        return;
    }

    const fields = get(uriField, 'transformers[0].args')
        .filter(({ type }) => type === 'column')
        .map(({ value }) => value);

    ctx.body = {
        nbInvalidUri: await ctx.dataset.countNotUnique(fields),
    };
};

app.use(route.get('/verifyUri', verifyUri));

app.use(route.post('/', preparePublish));
app.use(route.post('/', handlePublishError));

app.use(route.post('/', doPublish));

export default app;
