// @ts-expect-error TS(2792): Cannot find module 'koa'. Did you mean to set the ... Remove this comment to see the full error message
import Koa from 'koa';
// @ts-expect-error TS(2792): Cannot find module 'koa-route'. Did you mean to se... Remove this comment to see the full error message
import route from 'koa-route';
// @ts-expect-error TS(2792): Cannot find module 'koa-bodyparser'. Did you mean ... Remove this comment to see the full error message
import koaBodyParser from 'koa-bodyparser';
// @ts-expect-error TS(2792): Cannot find module 'lodash/get'. Did you mean to s... Remove this comment to see the full error message
import get from 'lodash/get';

// @ts-expect-error TS(2792): Cannot find module 'config'. Did you mean to set t... Remove this comment to see the full error message
import { auth } from 'config';
// @ts-expect-error TS(2792): Cannot find module 'jsonwebtoken'. Did you mean to... Remove this comment to see the full error message
import jwt from 'jsonwebtoken';
import {
    ADMIN_ROLE,
    CONTRIBUTOR_ROLE,
    ROOT_ROLE,
    USER_ROLE,
    // @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
} from '../../../common/tools/tenantTools';

export const postLogin = (date: any) => async (ctx: any) => {
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
    const contributorAuth = get(ctx, 'configTenant.contributorAuth', {});
    const rootAuth = get(ctx, 'ezMasterConfig.rootAuth', {});

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
