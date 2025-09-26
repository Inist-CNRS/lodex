// @ts-expect-error TS(2792): Cannot find module 'koa'. Did you mean to set the ... Remove this comment to see the full error message
import Koa from 'koa';
// @ts-expect-error TS(2792): Cannot find module 'koa-route'. Did you mean to se... Remove this comment to see the full error message
import route from 'koa-route';
// @ts-expect-error TS(2792): Cannot find module 'uuid'. Did you mean to set the... Remove this comment to see the full error message
import { v1 as uuid } from 'uuid';

import clearPublished from '../../services/clearPublished';
import { workerQueues } from '../../workers';
import { PUBLISHER } from '../../workers/publisher';
import getLogger from '../../services/logger';

const app = new Koa();

export const doPublish = async (ctx: any) => {
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
