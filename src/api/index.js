import Koa from 'koa';
import { Server } from 'socket.io';
import config from 'config';
import mount from 'koa-mount';
import cors from 'kcors';
import koaQs from 'koa-qs';
import { KoaAdapter } from '@bull-board/koa';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';

import logger from './services/logger';
import controller from './controller';
import testController from './controller/testController';
import indexSearchableFields from './services/indexSearchableFields';

import { workerQueue } from './workers';
import { addPublisherListener } from './workers/publisher';

import progress from './services/progress';
import { addEnrichmentJobListener } from './services/enrichment/enrichment';

const app = koaQs(new Koa());

app.use(cors({ credentials: true }));

if (process.env.EXPOSE_TEST_CONTROLLER) {
    app.use(mount('/tests', testController));
}
if (process.env.NODE_ENV === 'development') {
    const serverAdapter = new KoaAdapter();
    serverAdapter.setBasePath('/bull');
    createBullBoard({
        queues: [new BullAdapter(workerQueue)],
        serverAdapter,
    });
    app.use(serverAdapter.registerPlugin());
}

// worker job
app.use(async (ctx, next) => {
    try {
        const activeJobs = await workerQueue.getActive();
        ctx.job = activeJobs[0];
    } catch (e) {
        logger.error('An error occured on loading running job', e);
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
    logger.info(ctx.request.url, ctx.httpLog);
});

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

if (!module.parent) {
    indexSearchableFields();
    global.console.log(`Server listening on port ${config.port}`);
    global.console.log('Press CTRL+C to stop server');
    const httpServer = app.listen(config.port);
    const io = new Server(httpServer);

    io.on('connection', socket => {
        progress.addProgressListener(progress => {
            socket.emit('progress', progress);
        });
        addPublisherListener(payload => {
            socket.emit('publisher', payload);
        });
        addEnrichmentJobListener(payload => {
            socket.emit(payload.room, payload.data);
        });
    });
}

export default app;
