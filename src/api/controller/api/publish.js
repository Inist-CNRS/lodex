import Koa from 'koa';
import route from 'koa-route';
import { v1 as uuid } from 'uuid';

import clearPublished from '../../services/clearPublished';
import logger from '../../services/logger';
import { workerQueues } from '../../workers';
import { PUBLISHER } from '../../workers/publisher';

const app = new Koa();

export const doPublish = async ctx => {
    await workerQueues[ctx.tenant].add(
        PUBLISHER, // Name of the job
        { jobType: PUBLISHER, tenant: ctx.tenant },
        { jobId: uuid() },
    );
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
        logger.error(`handle clear published error - ${ctx.tenant}`, {
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
