import Koa from 'koa';
import route from 'koa-route';
import bodyParser from 'koa-bodyparser';

import { v1 as uuid } from 'uuid';

import { workerQueues } from '../workers';
import { PRECOMPUTER } from '../workers/precomputer';

export const getComputedWebserviceData = async (ctx) => {
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
        data.error = { type, message };
    }

    await workerQueues[tenant].add(
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
