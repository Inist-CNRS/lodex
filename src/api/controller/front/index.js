import Koa from 'koa';
import mount from 'koa-mount';

import dev from './dev';
import prod from './prod';

const app = new Koa();

const middleware = process.env.NODE_ENV === 'development' ? dev() : prod();

app.use(async (ctx, next) => {
    const uri = ctx.path;

    if (uri.startsWith('/ark:/') || uri.startsWith('/uid:/')) {
        // Override the path so that webpack serves the application correctly
        ctx.path = '/';
    }

    await next();
});

app.use(mount(middleware));

export default app;
