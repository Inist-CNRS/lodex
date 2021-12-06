import Koa from 'koa';
import route from 'koa-route';

import clearPublished from '../../services/clearPublished';
import logger from '../../services/logger';
import { publisherQueue, PUBLISH } from '../../workers/publisher';

const app = new Koa();

export const doPublish = async ctx => {
    await publisherQueue.add(PUBLISH);
    ctx.status = 200;
    ctx.body = {
        status: 'publishing',
    };
};

export const handleClearPublished = async ctx => {
    try {
        await clearPublished(ctx);
        ctx.body = {
            status: 'success',
        };
    } catch (error) {
        logger.error('handle clear published error', {
            error,
        });
        ctx.body = {
            status: 'error',
        };
    }
};

app.use(route.post('/', doPublish));

app.use(route.delete('/', handleClearPublished));

export default app;
