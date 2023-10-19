import Koa from 'koa';
import { Server } from 'socket.io';
import config, { mongo } from 'config';
import mount from 'koa-mount';
import route from 'koa-route';
import cors from 'kcors';
import koaQs from 'koa-qs';
import { KoaAdapter } from '@bull-board/koa';

import controller from './controller';
import testController from './controller/testController';
import indexSearchableFields from './services/indexSearchableFields';

import { createWorkerQueue, workerQueues } from './workers';
import { addPublisherListener } from './workers/publisher';

import progress from './services/progress';
import { addEnrichmentJobListener } from './services/enrichment/enrichment';
import { addImportListener } from './workers/import';

import Meter from '@uswitch/koa-prometheus';
import MeterConfig from '@uswitch/koa-prometheus/build/koa-prometheus.defaults.json';
import tracer, { eventTrace, eventError } from '@uswitch/koa-tracer';
import access, { eventAccess } from '@uswitch/koa-access';
import getLogger from './services/logger';
import tenant from './models/tenant';
import mongoClient from './services/mongoClient';
import bullBoard from './bullBoard';
import { DEFAULT_TENANT } from '../common/tools/tenantTools';

// KoaQs use qs to parse query string. There is an default limit of 20 items in an array. Above this limit, qs will transform the array into an key/value object.
// We need to increase this limit to 1000 to be able to handle the facets array in the query string.
// https://github.com/ljharb/qs#parsing-arrays
const app = koaQs(new Koa(), 'extended', { arrayLimit: 1000 });

app.use(cors({ credentials: true }));

function extractTenantFromUrl(url) {
    const match = url.match(/\/instance\/([^/]+)/);
    return match ? match[1] : null;
}

const setTenant = async (ctx, next) => {
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

if (process.env.EXPOSE_TEST_CONTROLLER) {
    app.use(mount('/tests', testController));
}

// ############################
// # START QUEUE AND BULL BOARD
// ############################

// Create an bull board instance
const serverAdapter = new KoaAdapter();
serverAdapter.setBasePath('/bull');
const initQueueAndBullDashboard = async () => {
    bullBoard.initBullBoard(serverAdapter);

    const defaultQueue = createWorkerQueue(DEFAULT_TENANT, 1);
    bullBoard.addDashboardQueue(DEFAULT_TENANT, defaultQueue);

    // Get current tenants
    const adminDb = await mongoClient('admin');
    const tenantCollection = await tenant(adminDb);
    const tenants = await tenantCollection.findAll();
    tenants.forEach(tenant => {
        const queue = createWorkerQueue(tenant.name, 1);
        bullBoard.addDashboardQueue(tenant.name, queue);
    });
};

initQueueAndBullDashboard();

// Display It only in development mode
if (process.env.NODE_ENV === 'development') {
    app.use(serverAdapter.registerPlugin());
}

// ############################
// # END QUEUE AND BULL BOARD
// ############################

// worker job
app.use(async (ctx, next) => {
    try {
        const activeJobs =
            (await workerQueues[ctx.tenant]?.getActive()) || null;

        if (!activeJobs) {
            return await next();
        }

        const filteredActiveJobs = activeJobs.filter(
            job => job.data.tenant === ctx.tenant,
        );
        ctx.job = filteredActiveJobs[0];
    } catch (e) {
        const logger = getLogger(ctx.tenant);
        logger.error(`An error occured on loading running job`, e);
    }
    await next();
});

// server logs
app.use(async (ctx, next) => {
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

// Prometheus metrics
const meters = Meter(MeterConfig, { loadStandards: true, loadDefaults: true });
app.use(meters.middleware); // The middleware that makes the meters available
app.use(route.get('/metrics', ctx => (ctx.body = meters.print())));

app.use(tracer());
app.use(access());
app.on(eventAccess, ctx => {
    meters.automark(ctx);
});
app.on(eventTrace, ctx => meters.automark(ctx));
app.on(eventError, () => meters.errorRate.mark(1));

app.use(function*(next) {
    try {
        yield next;
    } catch (err) {
        this.status = err.status || 500;
        this.body = err.message;
        this.app.emit('error', err, this);
    }
});

app.use(mount('/', controller));

app.use(async (ctx, next) => {
    if (!module.parent) {
        indexSearchableFields(ctx);
    }
    await next();
});

if (!module.parent) {
    global.console.log(`Server listening on port ${config.port}`);
    global.console.log('Press CTRL+C to stop server');
    const httpServer = app.listen(config.port);
    const io = new Server(httpServer);

    io.on('connection', socket => {
        const emitPayload = payload => {
            socket.emit(`${mongo.dbName}_${payload.room}`, payload.data);
        };

        progress.addProgressListener(emitPayload);
        addPublisherListener(emitPayload);
        addEnrichmentJobListener(emitPayload);
        addImportListener(emitPayload);
    });
}

export default app;
