// @ts-expect-error TS(2792): Cannot find module 'koa'. Did you mean to set the ... Remove this comment to see the full error message
import Koa from 'koa';
// @ts-expect-error TS(2792): Cannot find module 'koa-route'. Did you mean to se... Remove this comment to see the full error message
import route from 'koa-route';
// @ts-expect-error TS(2792): Cannot find module 'koa-bodyparser'. Did you mean ... Remove this comment to see the full error message
import bodyParser from 'koa-bodyparser';

// @ts-expect-error TS(2792): Cannot find module 'uuid'. Did you mean to set the... Remove this comment to see the full error message
import { v1 as uuid } from 'uuid';

import { workerQueues } from '../workers';
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
