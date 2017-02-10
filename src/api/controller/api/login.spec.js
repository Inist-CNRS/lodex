import { auth } from 'config';
import jwt from 'jsonwebtoken';
import expect from 'expect';

import { loginMiddleware as login } from './login';

describe('login', () => {
    it('should set ctx.status to 401, if ctx.body.username do not match with config', () => {
        const ctx = {
            ezMasterConfig: {
                username: 'user',
                password: 'secret',
            },
            request: {
                body: {
                    username: `not ${auth.username}`,
                    password: 'secret',
                },
            },
        };
        login()(ctx);
        expect(ctx.status).toBe(401);
    });

    it('should set ctx.status to 401, if ctx.body.password do not match with config', () => {
        const ctx = {
            ezMasterConfig: {
                username: 'user',
                password: 'secret',
            },
            request: {
                body: {
                    username: 'user',
                    password: `not ${auth.password}`,
                },
            },
        };
        login()(ctx);
        expect(ctx.status).toBe(401);
    });

    it('should return header token and set cookie with cookie token when password and user name match config', () => {
        let setCall;
        const ctx = {
            ezMasterConfig: {
                username: 'user',
                password: 'secret',
            },
            request: {
                body: {
                    username: 'user',
                    password: 'secret',
                },
            },
            cookies: {
                set(...args) {
                    setCall = args;
                },
            },
        };

        // This is set to now as default in login but we specify it here to avoid random failure in tests
        const expDate = Date.now();
        login(expDate)(ctx);
        expect(ctx.body).toEqual({
            token: jwt.sign({
                username: 'user',
                exp: Math.ceil(expDate / 1000) + auth.expiresIn,
            }, auth.headerSecret),
        });
        expect(setCall).toEqual([
            'lodex_token',
            jwt.sign({
                username: 'user',
                exp: Math.ceil(expDate / 1000) + auth.expiresIn,
            }, auth.cookieSecret),
            { httpOnly: true },
        ]);
    });
});
