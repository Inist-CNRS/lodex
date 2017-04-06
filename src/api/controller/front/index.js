import Koa from 'koa';
import mount from 'koa-mount';

import dev from './dev';
import prod from './prod';

const app = new Koa();

const middleware = process.env.NODE_ENV === 'development' ? dev() : prod();

app.use(async (ctx, next) => {
    const uri = ctx.path;

    if (uri.startsWith('/uid:/')
        || uri.startsWith('/ark:/')
        || uri.startsWith('/login')
        || uri.startsWith('/home')) {
        // Override the path so that webpack serves the application correctly
        ctx.path = '/';
    }

    if (uri.startsWith('/admin/')) {
        // Override the path so that webpack serves the application correctly
        ctx.path = '/admin';
    }

    await next();
});

app.use(mount(middleware));

export default app;
