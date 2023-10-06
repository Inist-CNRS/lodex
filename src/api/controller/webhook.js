import Koa from 'koa';
import route from 'koa-route';
import bodyParser from 'koa-bodyparser';

import logger from '../services/logger';
import { getComputedFromWebservice } from '../services/computeExternalRoutineInDocuments';

export const getComputedWebserviceData = async ctx => {
    logger.info('Webservice webhook call');
    logger.info('query', ctx.request.query);
    logger.info('body', ctx.request.body);
    const { webServiceBaseURL, tenant } = ctx.request.query;
    const { identifier, generator, state } = ctx.request.body;

    if (!state === 'ready') {
        return;
    }

    const callId = JSON.stringify([{ id: generator, value: identifier }]);

    if (!!tenant && !!webServiceBaseURL && !!callId) {
        getComputedFromWebservice(tenant, webServiceBaseURL, callId);
    } else {
        logger.error('Webservice webhook error');
        logger.error(ctx.request);
    }

    ctx.body = 'webhook ok';
    ctx.status = 200;
};

const app = new Koa();
app.use(bodyParser());
app.use(route.post('/compute_webservice/', getComputedWebserviceData));

export default app;
