import Koa from 'koa';
import config from 'config';
import mount from 'koa-mount';

import { httpLogger } from './services/logger';

const app = new Koa();

// server logs
app.use(async (ctx, next) => {
    ctx.httpLog = {
        method: ctx.request.method,
        remoteIP: ctx.request.ip,
        userAgent: ctx.request.headers['user-agent'],
    };
    var authorization = ctx.get('authorization');
    if (authorization) {
        ctx.httpLog.authorization = authorization;
    }
    await next;
    ctx.httpLog.status = ctx.status;
    httpLogger.info(ctx.request.url, ctx.httpLog);
});

// error catching - override koa's undocumented error handler
app.use(async (next) => {
    try {
        await next;
    } catch (error) {
        httpLogger.error(JSON.stringify(error));
        this.app.emit('error', error, this);

        if (this.headerSent || !this.writable) {
            error.headerSent = true;
            return;
        }
        this.status = error.status || 500;
        if (env === 'development') {
            // respond with the error details
            var message = {
                error: error.message,
                stack: error.stack,
                code: error.code
            };
            this.body = JSON.stringify(message);
            this.type = 'json';
        } else {
            // just send the error message
            this.body = error.message;
        }
        this.res.end(this.body);
    }
});

export default app;
