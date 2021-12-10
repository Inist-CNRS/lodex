import Koa from 'koa';
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
import { publisherQueue } from './workers/publisher';
import { enrichmentQueue } from './workers/enrichmentWorker';

const app = koaQs(new Koa());

app.use(cors({ credentials: true }));

if (process.env.EXPOSE_TEST_CONTROLLER) {
    app.use(mount('/tests', testController));
}
if (process.env.NODE_ENV === 'development') {
    const serverAdapter = new KoaAdapter();
    serverAdapter.setBasePath('/bull');
    createBullBoard({
        queues: [
            new BullAdapter(publisherQueue),
            new BullAdapter(enrichmentQueue),
        ],
        serverAdapter,
    });
    app.use(serverAdapter.registerPlugin());
}

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

app.use(mount('/', controller));

if (!module.parent) {
    indexSearchableFields();
    global.console.log(`Server listening on port ${config.port}`);
    global.console.log('Press CTRL+C to stop server');
    app.listen(config.port);
}

export default app;
