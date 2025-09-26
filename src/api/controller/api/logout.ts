// @ts-expect-error TS(2792): Cannot find module 'koa'. Did you mean to set the ... Remove this comment to see the full error message
import Koa from 'koa';
// @ts-expect-error TS(2792): Cannot find module 'koa-route'. Did you mean to se... Remove this comment to see the full error message
import route from 'koa-route';
// @ts-expect-error TS(2792): Cannot find module 'koa-bodyparser'. Did you mean ... Remove this comment to see the full error message
import koaBodyParser from 'koa-bodyparser';
import jwt from 'koa-jwt';
// @ts-expect-error TS(2792): Cannot find module 'config'. Did you mean to set t... Remove this comment to see the full error message
import { auth } from 'config';
// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { ROOT_ROLE } from '../../../common/tools/tenantTools';

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
        secret: auth.cookieSecret,
        cookie:
            ctx.tenant === 'admin'
                ? `lodex_token_root`
                : `lodex_token_${ctx.tenant}`,
        key: 'cookie',
        passthrough: true,
    });

    // @ts-expect-error TS(2349): This expression is not callable. Type Middleware has no call signatures.
    return jwtMid(ctx, next);
});

app.use(route.post('/', logout));

export default app;
