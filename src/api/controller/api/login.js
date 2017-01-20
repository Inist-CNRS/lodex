import { auth } from 'config';
import jwt from 'jsonwebtoken';

export default (ctx) => {
    const { username, password } = ctx.request.body;
    if (username !== auth.username || password !== auth.password) {
        ctx.status = 401;
        return;
    }

    const tokenData = {
        username,
        exp: Math.ceil(Date.now() / 1000) + auth.expiresIn,
    };

    const cookieToken = jwt.sign(tokenData, auth.cookieSecret);
    const headerToken = jwt.sign(tokenData, auth.headerSecret);

    ctx.cookies.set('lodex_token', cookieToken, { httpOnly: true });
    ctx.body = {
        token: headerToken,
    };
};
