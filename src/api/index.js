import Koa from 'koa';
import config from 'config';
import mount from 'koa-mount';
import cors from 'kcors';


import { httpLogger } from './services/logger';
import controller from './controller';

const env = process.env.NODE_ENV;
const app = new Koa();

app.use(cors());

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
    httpLogger.info(ctx.request.url, ctx.httpLog);
});

app.use(mount('/', controller));

// Error catching - override koa's undocumented error handler
app.context.onerror = function onError(err) {
    if (!err) return;

    this.status = err.status || 500;
    this.app.emit('error', err, this);

    if (this.headerSent || !this.writable) {
        err.headerSent = true; // eslint-disable-line no-param-reassign
        return;
    }

    if (env === 'development') {
        // respond with the error details
        this.body = JSON.stringify({
            error: err.message,
            stack: err.stack,
            code: err.code,
        });
        this.type = 'json';
    } else {
        // just send the error message
        this.body = err.message;
    }

    this.res.end(this.body);
};

if (!module.parent) {
    global.console.log(`Server listening on port ${config.port}`);
    global.console.log('Press CTRL+C to stop server');
    app.listen(config.port);
}

export default app;
