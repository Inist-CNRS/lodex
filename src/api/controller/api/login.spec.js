import { auth } from 'config';
import jwt from 'jsonwebtoken';

import { postLogin as login } from './login';

const expDate = Date.now();

describe('login', () => {
    it('should set ctx.status to 401, if ctx.body.username do not match with config', () => {
        const ctx = {
            ezMasterConfig: {
                username: 'admin',
                password: 'secret',
            },
            request: {
                body: {
                    username: 'not admin',
                    password: 'secret',
                },
            },
        };
        login(expDate)(ctx);
        expect(ctx.status).toBe(401);
    });

    it('should set ctx.status to 401, if ctx.body.password do not match with config', () => {
        const ctx = {
            ezMasterConfig: {
                username: 'admin',
                password: 'secret',
            },
            request: {
                body: {
                    username: 'user',
                    password: `not secret`,
                },
            },
        };
        login(expDate)(ctx);
        expect(ctx.status).toBe(401);
    });

    it('should return header token and set cookie with cookie token for admin when password and user name match config', () => {
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

        login(expDate)(ctx);
        expect(ctx.body).toEqual({
            token: jwt.sign(
                {
                    username: 'user',
                    role: 'admin',
                    exp: Math.ceil(expDate / 1000) + auth.expiresIn,
                },
                auth.headerSecret,
            ),
            role: 'admin',
        });
        expect(setCall).toEqual([
            'lodex_token',
            jwt.sign(
                {
                    username: 'user',
                    role: 'admin',
                    exp: Math.ceil(expDate / 1000) + auth.expiresIn,
                },
                auth.cookieSecret,
            ),
            { httpOnly: true },
        ]);
    });

    describe('user authentication', () => {
        it('should set ctx.status to 401, if ctx.body.username do not match with userAuth config', () => {
            const ctx = {
                ezMasterConfig: {
                    username: 'admin',
                    password: 'secret',
                    userAuth: {
                        username: 'user',
                        password: 'secret',
                    },
                },
                request: {
                    body: {
                        username: 'not user',
                        password: 'secret',
                    },
                },
            };
            login(expDate)(ctx);
            expect(ctx.status).toBe(401);
        });

        it('should set ctx.status to 401, if ctx.body.password do not match with config', () => {
            const ctx = {
                ezMasterConfig: {
                    username: 'admin',
                    password: 'secret',
                    userAuth: {
                        username: 'user',
                        password: 'secret',
                    },
                },
                request: {
                    body: {
                        username: 'user',
                        password: `not secret`,
                    },
                },
            };
            login(expDate)(ctx);
            expect(ctx.status).toBe(401);
        });

        it('should return header token and set cookie with cookie token for user when password and user name match userAuth config', () => {
            let setCall;
            const ctx = {
                ezMasterConfig: {
                    username: 'admin',
                    password: 'secret',
                    userAuth: {
                        username: 'user',
                        password: 'secret',
                    },
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

            login(expDate)(ctx);
            expect(ctx.body).toEqual({
                token: jwt.sign(
                    {
                        username: 'user',
                        role: 'user',
                        exp: Math.ceil(expDate / 1000) + auth.expiresIn,
                    },
                    auth.headerSecret,
                ),
                role: 'user',
            });
            expect(setCall).toEqual([
                'lodex_token',
                jwt.sign(
                    {
                        username: 'user',
                        role: 'user',
                        exp: Math.ceil(expDate / 1000) + auth.expiresIn,
                    },
                    auth.cookieSecret,
                ),
                { httpOnly: true },
            ]);
        });
    });
});
