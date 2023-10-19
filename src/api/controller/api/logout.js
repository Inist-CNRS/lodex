import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import jwt from 'koa-jwt';
import { auth } from 'config';

export const logout = ctx => {
    // if cookie role is root, delete corresponding cookie else delete tenant cookie
    if (ctx.state.cookie.role === 'root') {
        ctx.cookies.set(`lodex_token_root`, '', { expires: new Date() });
    } else {
        ctx.cookies.set(`lodex_token_${ctx.tenant}`, '', {
            expires: new Date(),
        });
    }

    ctx.body = 'OK';
};

const app = new Koa();

app.use(koaBodyParser());

app.use(async (ctx, next) => {
    const jwtMid = await jwt({
        secret: auth.cookieSecret,
        cookie:
            ctx.tenant === 'admin'
                ? `lodex_token_root`
                : `lodex_token_${ctx.tenant}`,
        key: 'cookie',
        passthrough: true,
    });

    return jwtMid(ctx, next);
});

app.use(route.post('/', logout));

export default app;
