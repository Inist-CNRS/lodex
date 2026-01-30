import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import get from 'lodash/get';

import config from 'config';
import jwt from 'jsonwebtoken';
import {
    ADMIN_ROLE,
    CONTRIBUTOR_ROLE,
    ROOT_ROLE,
    USER_ROLE,
} from '@lodex/common';

const auth = config.get('auth');

export const postLogin = (date: any) => async (ctx: any) => {
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
    const contributorAuth = get(ctx, 'configTenant.contributorAuth', {});
    const rootAuth = config.get('rootAuth');

    let role;
    if (username === usernameAdmin && password === passwordAdmin) {
        role = ADMIN_ROLE;
    }

    if (
        userAuth &&
        userAuth.active &&
        username === userAuth.username &&
        password === userAuth.password
    ) {
        role = USER_ROLE;
    }

    if (
        contributorAuth &&
        contributorAuth.active &&
        username === contributorAuth.username &&
        password === contributorAuth.password
    ) {
        role = CONTRIBUTOR_ROLE;
    }

    if (
        rootAuth &&
        // @ts-expect-error TS(TS2339): Property 'username' does not exist on type '{}'.
        username === rootAuth.username &&
        // @ts-expect-error TS(TS2339): Property 'password' does not exist on type '{}'.
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
    // @ts-expect-error TS(18046): auth is of type unknown
    exp += auth.expiresIn;

    const tokenData = {
        username,
        role,
        exp,
    };

    // @ts-expect-error TS(18046): auth is of type unknown
    const cookieToken = jwt.sign(tokenData, auth.cookieSecret);
    // @ts-expect-error TS(18046): auth is of type unknown
    const headerToken = jwt.sign(tokenData, auth.headerSecret);

    ctx.status = 200;
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
// @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
app.use(route.post('/', postLogin()));

export default app;
