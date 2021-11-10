import Koa from 'koa';
import route from 'koa-route';
import { PUBLISH_DOCUMENT } from '../../../common/progressStatus';
import progress from '../../services/progress';

import { publisherQueue, PUBLISH } from '../../workers/publisher';

const app = new Koa();

export const doPublish = async ctx => {
    publisherQueue.add(PUBLISH);
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
        progress.start(UNPUBLISH_DOCUMENT);
        await ctx.publishedDataset.remove({});
        await ctx.publishedCharacteristic.remove({});
        await ctx.publishedFacet.remove({});
        progress.finish();
        ctx.body = {
            status: 'success',
        };
    } catch (error) {
        ctx.body = {
            status: 'error',
        };
    }
};

app.use(route.post('/', doPublish));

app.use(route.delete('/', clearPublished));

export default app;
