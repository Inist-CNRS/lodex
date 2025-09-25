import Koa from 'koa';
import { activateBullDashboard, timeout } from '../../config.json';
import mount from 'koa-mount';
import route from 'koa-route';
import cors from 'kcors';
import koaQs from 'koa-qs';
import { KoaAdapter } from '@bull-board/koa';

import ezs from '@ezs/core';
import controller from './controller';
import testController from './controller/testController';
import indexSearchableFields from './services/indexSearchableFields';
import { createWorkerQueue, workerQueues } from './workers';
import progress from './services/progress';
// @ts-expect-error TS(2792): Cannot find module '@uswitch/koa-prometheus'. Did ... Remove this comment to see the full error message
import Meter, { collectMetrics } from '@uswitch/koa-prometheus';
// @ts-expect-error TS(2792): Cannot find module '@uswitch/koa-tracer'. Did you ... Remove this comment to see the full error message
import tracer, { eventTrace, eventError } from '@uswitch/koa-tracer';
// @ts-expect-error TS(2792): Cannot find module '@uswitch/koa-access'. Did you ... Remove this comment to see the full error message
import access, { eventAccess } from '@uswitch/koa-access';
import getLogger from './services/logger';
import tenant from './models/tenant';
import mongoClient from './services/mongoClient';
import bullBoard from './bullBoard';
// @ts-expect-error TS(7016): Could not find a declaration file for module '../c... Remove this comment to see the full error message
import { DEFAULT_TENANT } from '../common/tools/tenantTools';
import { insertConfigTenant } from './services/configTenant';

const meters = Meter([], { loadStandards: true, loadDefaults: true });

// set timeout as ezs server (see workers/index.js)
ezs.settings.feed.timeout = Number(timeout) || 120000;

// KoaQs use qs to parse query string. There is an default limit of 20 items in an array. Above this limit, qs will transform the array into an key/value object.
// We need to increase this limit to 1000 to be able to handle the facets array in the query string.
// https://github.com/ljharb/qs#parsing-arrays
// @ts-expect-error The third argument of koaQs is not defined in the type definition, but it is supported.
const app = koaQs(new Koa(), 'extended', { arrayLimit: 1000 });

// Prometheus metrics
// to enable koa-prometheus log process.env.DEBUG_KOA = true;
app.use(tracer());
app.use(access(['id', 'trace', 'errors']));
collectMetrics({ prefix: '' }); // no prefix to be compatible with standard dashboards
app.use(async (ctx, next) => {
    ctx._matchedRoute = ctx.originalUrl; // _matchedRoute is used by koa-prometheus
    await next();
});
app.use(
    route.get('/metrics', async (ctx) => {
        ctx.body = await meters.print();
    }),
);
app.use(meters.middleware); // The middleware that makes the meters available

app.on(eventAccess, (ctx, extra) => meters.automark({ ...ctx, ...extra }));
app.on(eventTrace, (ctx, extra) => meters.automark({ ...ctx, ...extra }));
app.on(eventError, () => meters.koaErrorsPerSecond.mark(1));

app.use(cors({ credentials: true }));

function extractTenantFromUrl(url: any) {
    const match = url.match(/\/instance\/([^/]+)/);
    return match ? match[1].toLowerCase() : null;
}

const setTenant = async (ctx: any, next: any) => {
    if (extractTenantFromUrl(ctx.request.url)) {
        ctx.tenant = extractTenantFromUrl(ctx.request.url);
    } else if (ctx.get('X-Lodex-Tenant')) {
        ctx.tenant = ctx.get('X-Lodex-Tenant');
    } else {
        ctx.tenant = DEFAULT_TENANT;
    }

    progress.initialize(ctx.tenant);
    await next();
};

app.use(setTenant);

// ############################
// # START QUEUE AND BULL BOARD
// ############################

// Create an bull board instance
const serverAdapter = new KoaAdapter();
serverAdapter.setBasePath('/bull');
const initQueueAndBullDashboard = async () => {
    bullBoard.initBullBoard(serverAdapter);
    // Get current tenants
    const adminDb = await mongoClient('admin');
    const tenantCollection = await tenant(adminDb);

    const tenants = await tenantCollection.findAll();
    tenants.forEach((tenant: any) => {
        const queue = createWorkerQueue(tenant.name, 1);
        bullBoard.addDashboardQueue(tenant.name, queue);
    });
    // if tenant `default` is not in the database, we add it
    if (!tenants.find((tenant: any) => tenant.name === DEFAULT_TENANT)) {
        await tenantCollection.create({
            name: DEFAULT_TENANT,
            description: 'Instance par défaut',
            author: 'Root',
            username: 'admin',
            password: 'secret',
            createdAt: new Date(),
        });
        const defaultQueue = createWorkerQueue(DEFAULT_TENANT, 1);
        bullBoard.addDashboardQueue(DEFAULT_TENANT, defaultQueue);
    }
    insertConfigTenant(DEFAULT_TENANT);
};

initQueueAndBullDashboard();

// Display It only in development mode or if activateBullDashboard is true
if (process.env.NODE_ENV === 'development' || activateBullDashboard) {
    app.use(serverAdapter.registerPlugin());
}

// ############################
// # END QUEUE AND BULL BOARD
// ############################

if (process.env.EXPOSE_TEST_CONTROLLER) {
    app.use(mount('/tests', testController));
}

// worker job
app.use(async (ctx: any, next: any) => {
    try {
        const activeJobs =
            (await workerQueues[ctx.tenant]?.getActive()) || null;

        if (!activeJobs) {
            return await next();
        }

        const filteredActiveJobs = activeJobs.filter(
            (job: any) => job.data.tenant === ctx.tenant,
        );
        ctx.job = filteredActiveJobs[0];
    } catch (e) {
        const logger = getLogger(ctx.tenant);
        logger.error(`An error occured on loading running job`, e);
    }
    await next();
});

// server logs
app.use(async (ctx: any, next: any) => {
    ctx.httpLog = {
        method: ctx.request.method,
        remoteIP: ctx.request.ip,
        userAgent: ctx.request.headers['user-agent'],
    };
    const authorization = ctx.get('authorization');
    if (authorization) {
        ctx.httpLog.authorization = authorization;
    }
    await next();
    ctx.httpLog.status = ctx.status;
    const logger = getLogger(ctx.tenant);
    logger.info(ctx.request.url, ctx.httpLog);
});

app.use(function* (this: any, next: any) {
    try {
        yield next;
    } catch (err) {
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        this.status = err.status || 500;
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        this.body = err.message;
        this.app.emit('error', err, this);
    }
});

app.use(mount('/', controller));

app.use(async (ctx: any, next: any) => {
    if (!module.parent) {
        indexSearchableFields(ctx);
    }
    await next();
});

app.on('uncaughtException', (error: any) => {
    console.error('Uncaught Exception', error);
});

process.on('unhandledRejection', (error: any) => {
    console.error('Uncaught Rejection', error);
});

process.on('uncaughtException', (error: any) => {
    console.error('Uncaught Exception', error);
});

export default app;
