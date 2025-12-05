import Koa from 'koa';
import route from 'koa-route';
import { v1 as uuid } from 'uuid';

import clearPublished from '../../services/clearPublished';
import getLogger from '../../services/logger';
import { getOrCreateWorkerQueue } from '../../workers';
import { PUBLISHER } from '../../workers/publisher';

const app = new Koa();

export const doPublish = async (ctx: any) => {
    await getOrCreateWorkerQueue(ctx.tenant, 1).add(
        PUBLISHER, // Name of the job
        { jobType: PUBLISHER, tenant: ctx.tenant },
        { jobId: uuid() },
    );
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
