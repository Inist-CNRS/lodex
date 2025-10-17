import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import jwt from 'koa-jwt';
import config from 'config';
import { ROOT_ROLE } from '../../../common/tools/tenantTools';

const auth = config.get('auth');

export const logout = (ctx: any) => {
    // if cookie role is root, delete corresponding cookie else delete tenant cookie
    if (ctx.state?.cookie?.role === ROOT_ROLE) {
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

app.use(async (ctx: any, next: any) => {
    const jwtMid = await jwt({
        // @ts-expect-error TS(18046): auth is of type unknown
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
