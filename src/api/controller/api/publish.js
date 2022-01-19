import Koa from 'koa';
import route from 'koa-route';

import clearPublished from '../../services/clearPublished';
import logger from '../../services/logger';
import { workerQueue } from '../../workers';
import { PUBLISHER } from '../../workers/publisher';

const app = new Koa();

export const doPublish = async ctx => {
    await workerQueue.add({ jobType: PUBLISHER });
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
