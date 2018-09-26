import Koa from 'koa';
import config from 'config';
import mount from 'koa-mount';
import cors from 'kcors';
import koaQs from 'koa-qs';

import logger from './services/logger';
import controller from './controller';
import testController from './controller/test';
import mongoClient from './services/mongoClient';

mongoClient();

const app = koaQs(new Koa());

app.use(cors({ credentials: true }));

if (process.env.EXPOSE_TEST_CONTROLLER) {
    app.use(mount('/tests', testController));
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
    global.console.log(`Server listening on port ${config.port}`);
    global.console.log('Press CTRL+C to stop server');
    app.listen(config.port);
}

export default app;
