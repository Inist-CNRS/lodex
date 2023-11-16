import Koa from 'koa';
import route from 'koa-route';
import bodyParser from 'koa-bodyparser';

import getLogger from '../services/logger';
import {
    getComputedFromWebservice,
    getFailureFromWebservice,
} from '../services/precomputed/precomputed';

export const getComputedWebserviceData = async ctx => {
    const { precomputedId, tenant, jobId, failure } = ctx.request.query;
    const { identifier, generator, state } = ctx.request.body;
    const logger = getLogger(ctx.tenant);
    logger.info(`Precompute webhook call for ${tenant}`);
    logger.info('Query', ctx.request.query);

    const callId = JSON.stringify([{ id: generator, value: identifier }]);

    if (failure !== undefined) {
        const { type, message } = ctx.request.body.error;
        logger.info('Precompute webservice call with failure');
        await getFailureFromWebservice(
            ctx,
            tenant,
            precomputedId,
            callId,
            jobId,
            type,
            message,
        );
        ctx.body = 'webhook failure';
        ctx.status = 200;
        return;
    }

    if (state !== 'ready') {
        return;
    }

    await getComputedFromWebservice(ctx, tenant, precomputedId, callId, jobId);

    ctx.body = 'webhook ok';
    ctx.status = 200;
};

const app = new Koa();
app.use(bodyParser());
app.use(route.post('/compute_webservice/', getComputedWebserviceData));

export default app;
