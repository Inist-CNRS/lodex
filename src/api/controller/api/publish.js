import Koa from 'koa';
import route from 'koa-route';

import publishDocuments from '../../services/publishDocuments';
import publishCharacteristics from '../../services/publishCharacteristics';
import publishFacets from './publishFacets';
import { publisherQueue } from '../../workers/publisher';

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
        await ctx.publishedDataset.remove({});
        await ctx.publishedCharacteristic.remove({});
        throw error;
    }
};

export const doPublish = async ctx => {
    publisherQueue.add(ctx);
    ctx.status = 200;
    ctx.body = {
        status: 'success',
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

        ctx.body = {
            status: 'success',
        };
    } catch (error) {
        ctx.body = {
            status: 'error',
        };
    }
};

app.use(route.post('/', preparePublish));
app.use(route.post('/', handlePublishError));
app.use(route.post('/', doPublish));

app.use(route.delete('/', clearPublished));

export default app;
