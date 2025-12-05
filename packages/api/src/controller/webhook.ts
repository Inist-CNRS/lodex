import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import route from 'koa-route';

import { v1 as uuid } from 'uuid';

import { getOrCreateWorkerQueue } from '../workers';
import { PRECOMPUTER } from '../workers/precomputer';

export const getComputedWebserviceData = async (ctx: any) => {
    const { precomputedId, tenant, jobId, failure } = ctx.request.query;
    const { identifier, generator, state } = ctx.request.body;
    const callId = JSON.stringify([{ id: generator, value: identifier }]);

    const data = {
        id: precomputedId,
        jobType: PRECOMPUTER,
        action: 'getPrecomputed',
        tenant: tenant,
        callId,
        failure,
        state,
        askForPrecomputedJobId: jobId,
    };

    // if error message, pass it to the worker
    if (failure !== undefined) {
        const { type, message } = ctx.request.body.error;
        // @ts-expect-error TS(2339): Property 'error' does not exist on type '{ id: any... Remove this comment to see the full error message
        data.error = { type, message };
    }

    await getOrCreateWorkerQueue(tenant, 1).add(
        PRECOMPUTER, // Name of the job
        data,
        { jobId: uuid() },
    );
    ctx.body = 'webhook ok';
    ctx.status = 200;
};

const app = new Koa();
app.use(bodyParser());
app.use(route.post('/compute_webservice/', getComputedWebserviceData));

export default app;
