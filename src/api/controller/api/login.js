import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import get from 'lodash/get';

import { auth } from 'config';
import jwt from 'jsonwebtoken';
import { ADMIN_ROLE, ROOT_ROLE } from '../../../common/tools/tenantTools';

export const postLogin = (date) => async (ctx) => {
    if (!ctx.ezMasterConfig) {
        throw new Error('Invalid EzMaster configuration.');
    }

    const { username: usernameAdmin, password: passwordAdmin } =
        await ctx.tenantCollection.findOneByName(ctx.tenant.toLowerCase());

    if (!usernameAdmin) {
        throw new Error('Invalid instance configuration: missing username');
    }

    if (!passwordAdmin) {
        throw new Error('Invalid instance configuration: missing password.');
    }

    const { username, password } = ctx.request.body;
    const userAuth = get(ctx, 'configTenant.userAuth', {});
    const rootAuth = get(ctx, 'ezMasterConfig.rootAuth', {});

    let role;
    if (username === usernameAdmin && password === passwordAdmin) {
        role = ADMIN_ROLE;
    }

    if (
        userAuth &&
        username === userAuth.username &&
        password === userAuth.password
    ) {
        role = 'user';
    }

    if (
        rootAuth &&
        username === rootAuth.username &&
        password === rootAuth.password
    ) {
        role = ROOT_ROLE;
    }

    if (!role) {
        ctx.status = 401;
        return;
    }

    let exp;
    if (!date) {
        exp = Math.ceil(Date.now() / 1000);
    } else {
        exp = Math.ceil(date / 1000);
    }
    exp += auth.expiresIn;

    const tokenData = {
        username,
        role,
        exp,
    };

    const cookieToken = jwt.sign(tokenData, auth.cookieSecret);
    const headerToken = jwt.sign(tokenData, auth.headerSecret);

    ctx.cookies.set(
        role === ROOT_ROLE ? 'lodex_token_root' : `lodex_token_${ctx.tenant}`,
        cookieToken,
        { httpOnly: true },
    );
    ctx.body = {
        token: headerToken,
        role,
    };
};

const app = new Koa();

app.use(koaBodyParser());
app.use(route.post('/', postLogin()));

export default app;
