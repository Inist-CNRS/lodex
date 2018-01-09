import omit from 'lodash.omit';
import Koa from 'koa';
import route from 'koa-route';
import get from 'lodash.get';

/* eslint no-await-in-loop: off */
import getDocumentTransformer from '../../services/getDocumentTransformer';
import getAddUriTransformer from '../../services/getAddUriTransformer';
import transformAllDocuments from '../../services/transformAllDocuments';
import publishCharacteristics from '../../services/publishCharacteristics';
import publishFacets from './publishFacets';

const app = new Koa();

export const addTransformResultToDoc = transform => async doc => ({
    ...omit(doc, ['_id']),
    ...(await transform(doc)),
});

export const versionTransformResult = transformDocument => async (
    doc,
    _,
    __,
    publicationDate = new Date(),
) => ({
    uri: doc.uri,
    versions: [
        {
            ...(await transformDocument(doc)),
            publicationDate,
        },
    ],
});

export const preparePublish = async (ctx, next) => {
    ctx.transformAllDocuments = transformAllDocuments;
    ctx.addTransformResultToDoc = addTransformResultToDoc;
    ctx.versionTransformResult = versionTransformResult;
    ctx.publishCharacteristics = publishCharacteristics;
    ctx.publishFacets = publishFacets;
    ctx.getDocumentTransformer = getDocumentTransformer(ctx);
    ctx.getAddUriTransformer = getAddUriTransformer(ctx);
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

export const doPublish = async ctx => {
    const count = await ctx.dataset.count({});

    const fields = await ctx.field.findAll();
    const collectionCoverFields = fields.filter(c => c.cover === 'collection');

    const uriCol = fields.find(col => col.name === 'uri');
    const addUri = ctx.getAddUriTransformer(uriCol);

    await ctx.transformAllDocuments(
        count,
        ctx.dataset.findLimitFromSkip,
        ctx.uriDataset.insertBatch,
        addUri,
    );

    const transformDocument = ctx.getDocumentTransformer(
        collectionCoverFields.filter(col => col.name !== 'uri'),
    );

    const transformDocumentAndKeepUri = ctx.versionTransformResult(
        transformDocument,
    );

    const uriDocCount = await ctx.uriDataset.count({});
    await ctx.transformAllDocuments(
        uriDocCount,
        ctx.uriDataset.findLimitFromSkip,
        ctx.publishedDataset.insertBatch,
        transformDocumentAndKeepUri,
    );

    const datasetCoverFields = fields.filter(c => c.cover === 'dataset');
    await ctx.publishCharacteristics(ctx, datasetCoverFields, count);
    await ctx.publishFacets(ctx, fields);

    ctx.redirect('/api/publication');
};

export const verifyUri = async ctx => {
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

export const clearPublished = async ctx => {
    try {
        await ctx.publishedDataset.remove({});
        await ctx.publishedCharacteristic.remove({});
        await ctx.publishedFacet.remove({});
        await ctx.uriDataset.remove({});

        ctx.body = {
            status: 'success',
        };
    } catch (error) {
        ctx.body = {
            status: 'error',
        };
    }
};

app.use(route.get('/verifyUri', verifyUri));

app.use(route.post('/', preparePublish));
app.use(route.post('/', handlePublishError));

app.use(route.post('/', doPublish));

app.use(route.delete('/', clearPublished));

export default app;
