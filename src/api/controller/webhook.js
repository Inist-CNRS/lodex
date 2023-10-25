import Koa from 'koa';
import route from 'koa-route';
import bodyParser from 'koa-bodyparser';

import getLogger from '../services/logger';
import { getComputedFromWebservice } from '../services/precomputed/precomputed';

export const getComputedWebserviceData = async ctx => {
    const { precomputedId, tenant, jobId } = ctx.request.query;
    const { identifier, generator, state } = ctx.request.body;
    const logger = getLogger(ctx.tenant);
    logger.info(`Precompute webhook call for ${tenant}`);
    logger.info('Body', ctx.request.body);

    if (!state === 'ready') {
        return;
    }

    const callId = JSON.stringify([{ id: generator, value: identifier }]);

    await getComputedFromWebservice(ctx, tenant, precomputedId, callId, jobId);

    ctx.body = 'webhook ok';
    ctx.status = 200;
};

const app = new Koa();
app.use(bodyParser());
app.use(route.post('/compute_webservice/', getComputedWebserviceData));

export default app;
