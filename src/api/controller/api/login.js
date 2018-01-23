import Koa from 'koa';
import route from 'koa-route';
import koaBodyParser from 'koa-bodyparser';
import get from 'lodash.get';

import { auth } from 'config';
import jwt from 'jsonwebtoken';

export const postLogin = date => ctx => {
    if (!ctx.ezMasterConfig) {
        throw new Error('Invalid EzMaster configuration.');
    }

    if (!ctx.ezMasterConfig.username) {
        throw new Error('Invalid EzMaster configuration: missing username');
    }

    if (!ctx.ezMasterConfig.password) {
        throw new Error('Invalid EzMaster configuration: missing password.');
    }

    const { username, password } = ctx.request.body;
    const userAuth = get(ctx, 'ezMasterConfig.userAuth', {});

    let role;
    if (
        username === ctx.ezMasterConfig.username &&
        password === ctx.ezMasterConfig.password
    ) {
        role = 'admin';
    }

    if (
        userAuth &&
        username === userAuth.username &&
        password === userAuth.password
    ) {
        role = 'user';
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

    ctx.cookies.set('lodex_token', cookieToken, { httpOnly: true });
    ctx.body = {
        token: headerToken,
        role,
    };
};

const app = new Koa();

app.use(koaBodyParser());
app.use(route.post('/', postLogin()));

export default app;
