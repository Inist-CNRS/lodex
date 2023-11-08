import { auth } from 'config';
import jwt from 'jsonwebtoken';

import { postLogin as login } from './login';
import { ADMIN_ROLE } from '../../../common/tools/tenantTools';

const expDate = Date.now();

describe('login', () => {
    it('should set ctx.status to 401, if ctx.body.username do not match with config', async () => {
        const ctx = {
            ezMasterConfig: {},
            tenantCollection: {
                findOneByName: () => ({
                    username: 'admin',
                    password: 'secret',
                }),
            },
            tenant: 'default',
            request: {
                body: {
                    username: 'not admin',
                    password: 'secret',
                },
            },
        };
        await login(expDate)(ctx);
        expect(ctx.status).toBe(401);
    });

    it('should set ctx.status to 401, if ctx.body.password do not match with config', async () => {
        const ctx = {
            ezMasterConfig: {},
            tenantCollection: {
                findOneByName: () => ({
                    username: 'admin',
                    password: 'secret',
                }),
            },
            tenant: 'default',
            request: {
                body: {
                    username: 'user',
                    password: `not secret`,
                },
            },
        };
        await login(expDate)(ctx);
        expect(ctx.status).toBe(401);
    });

    it('should return header token and set cookie with cookie token for admin when password and user name match config', async () => {
        let setCall;
        const ctx = {
            ezMasterConfig: {},
            tenantCollection: {
                findOneByName: () => ({
                    username: 'admin',
                    password: 'secret',
                }),
            },
            tenant: 'default',
            request: {
                body: {
                    username: 'admin',
                    password: 'secret',
                },
            },
            cookies: {
                set(...args) {
                    setCall = args;
                },
            },
        };

        await login(expDate)(ctx);
        expect(ctx.body).toEqual({
            token: jwt.sign(
                {
                    username: 'admin',
                    role: ADMIN_ROLE,
                    exp: Math.ceil(expDate / 1000) + auth.expiresIn,
                },
                auth.headerSecret,
            ),
            role: ADMIN_ROLE,
        });
        expect(setCall).toEqual([
            'lodex_token_default',
            jwt.sign(
                {
                    username: 'admin',
                    role: ADMIN_ROLE,
                    exp: Math.ceil(expDate / 1000) + auth.expiresIn,
                },
                auth.cookieSecret,
            ),
            { httpOnly: true },
        ]);
    });

    describe('user authentication', () => {
        it('should set ctx.status to 401, if ctx.body.username do not match with userAuth config', async () => {
            const ctx = {
                ezMasterConfig: {
                    userAuth: {
                        username: 'user',
                        password: 'secret',
                        active: true,
                    },
                },
                tenantCollection: {
                    findOneByName: () => ({
                        username: 'admin',
                        password: 'secret',
                    }),
                },
                tenant: 'default',
                request: {
                    body: {
                        username: 'not user',
                        password: 'secret',
                    },
                },
            };
            await login(expDate)(ctx);
            expect(ctx.status).toBe(401);
        });

        it('should set ctx.status to 401, if ctx.body.password do not match with config', async () => {
            const ctx = {
                ezMasterConfig: {
                    userAuth: {
                        username: 'user',
                        password: 'secret',
                        active: true,
                    },
                },
                tenantCollection: {
                    findOneByName: () => ({
                        username: 'admin',
                        password: 'secret',
                    }),
                },
                tenant: 'default',
                request: {
                    body: {
                        username: 'user',
                        password: `not secret`,
                    },
                },
            };
            await login(expDate)(ctx);
            expect(ctx.status).toBe(401);
        });

        it('should return header token and set cookie with cookie token for user when password and user name match userAuth config', async () => {
            let setCall;
            const ctx = {
                configTenant: {
                    userAuth: {
                        username: 'user',
                        password: 'secret',
                        active: true,
                    },
                },
                ezMasterConfig: {},
                tenantCollection: {
                    findOneByName: () => ({
                        username: 'admin',
                        password: 'secret',
                    }),
                },
                tenant: 'default',
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

            await login(expDate)(ctx);
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
                'lodex_token_default',
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
