import Koa from 'koa';
import route from 'koa-route';
import { randomUUID } from 'node:crypto';

import clearPublished from '../../services/clearPublished';
import getLogger from '../../services/logger';
import { queuePublisher } from '../../workers/tools';

const app = new Koa();

export const doPublish = async (ctx: any) => {
    await queuePublisher(ctx.tenant, randomUUID());
    ctx.status = 200;
    ctx.body = {
        status: 'publishing',
    };
};

export const handleClearPublished = async (ctx: any) => {
    try {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        await clearPublished(ctx);
        ctx.body = {
            status: 'success',
        };
    } catch (error) {
        const logger = getLogger(ctx.tenant);
        logger.error(`Handle clear published error`, {
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
