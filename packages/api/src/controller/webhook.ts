import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import route from 'koa-route';

import { randomUUID } from 'node:crypto';

import getLogger from '../services/logger';
import { getOrCreateWorkerQueue } from '../workers';
import { PRECOMPUTER } from '../workers/precomputer';
import {
    getPrecomputedCollectionForWebHook,
    getTenantCollection,
} from '../services/repositoryMiddleware';
import mongoClient from '../services/mongoClient';
import { getAskForPrecomputedJobId } from '../services/precomputed/precomputed';

// The webhook is public: an unknown tenant must not open a Mongo client nor
// create a Bull queue, both kept for the life of the process
const isKnownTenant = async (tenant: unknown) => {
    if (typeof tenant !== 'string' || !tenant) {
        return false;
    }
    const tenantCollection = await getTenantCollection(
        await mongoClient('admin'),
    );
    return !!(await tenantCollection.findOneByName(tenant));
};

export const getComputedWebserviceData = async (ctx: any) => {
    const { precomputedId, tenant, jobId, failure } = ctx.request.query;
    if (!(await isKnownTenant(tenant))) {
        ctx.status = 404;
        ctx.body = 'unknown tenant';
        return;
    }
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

    try {
        const precomputedCollection =
            await getPrecomputedCollectionForWebHook(tenant);
        await precomputedCollection.markAnswered(
            precomputedId,
            getAskForPrecomputedJobId(tenant, jobId),
        );
    } catch (error) {
        getLogger(tenant).error(
            `Failed to mark precomputation ${precomputedId} as answered`,
            error,
        );
    }

    await getOrCreateWorkerQueue(tenant, 1).add(
        PRECOMPUTER, // Name of the job
        data,
        { jobId: randomUUID() },
    );
    ctx.body = 'webhook ok';
    ctx.status = 200;
};

const app = new Koa();
app.use(bodyParser());
app.use(route.post('/compute_webservice/', getComputedWebserviceData));

export default app;
