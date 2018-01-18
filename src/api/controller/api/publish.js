import Koa from 'koa';
import route from 'koa-route';
import get from 'lodash.get';
import publishDocuments from '../../services/publishDocuments';
import publishCharacteristics from '../../services/publishCharacteristics';
import publishFacets from './publishFacets';

const app = new Koa();

export const preparePublish = async (ctx, next) => {
    ctx.publishDocuments = publishDocuments;
    ctx.publishCharacteristics = publishCharacteristics;
    ctx.publishFacets = publishFacets;
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

    await ctx.publishDocuments(ctx, count, collectionCoverFields);

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
        await ctx.dataset.updateMany(
            {},
            { $unset: { lodex_published: '' } },
            { multi: true },
        );
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
