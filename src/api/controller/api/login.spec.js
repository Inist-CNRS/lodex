import { auth } from 'config';
import jwt from 'jsonwebtoken';

import { postLogin as login } from './login';
import { ADMIN_ROLE } from '../../../common/tools/tenantTools';
import ezMasterConfig from '../../services/ezMasterConfig';

const expDate = Date.now();

describe('login', () => {
    describe('admin authentication', () => {
        it('should set ctx.status to 401, if ctx.body.username do not match with config', async () => {
            const setCookies = jest.fn();
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
                cookies: {
                    set: setCookies,
                },
            };
            await login(expDate)(ctx);
            expect(ctx.status).toBe(401);
            expect(setCookies).not.toHaveBeenCalled();
        });

        it('should set ctx.status to 401, if ctx.body.password do not match with config', async () => {
            const setCookies = jest.fn();
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
                        password: `not secret`,
                    },
                },
                cookies: {
                    set: setCookies,
                },
            };
            await login(expDate)(ctx);
            expect(ctx.status).toBe(401);
            expect(setCookies).not.toHaveBeenCalled();
        });

        it('should return header token and set cookie with cookie token for admin when password and user name match config', async () => {
            let setCookies = jest.fn();
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
                    set: setCookies,
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
            expect(setCookies).toHaveBeenCalledWith(
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
            );
        });
    });

    describe('user authentication', () => {
        it('should set ctx.status to 401, if user auth is not active', async () => {
            const setCookies = jest.fn();
            const ctx = {
                ezMasterConfig: {
                    userAuth: {
                        username: 'user',
                        password: 'secret',
                        active: false,
                    },
                    contributorAuth: {
                        username: 'contributor',
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
                        password: `secret`,
                    },
                },
                cookies: {
                    set: setCookies,
                },
            };
            await login(expDate)(ctx);
            expect(ctx.status).toBe(401);
            expect(setCookies).not.toHaveBeenCalled();
        });
        it('should set ctx.status to 401, if ctx.body.username do not match with userAuth config', async () => {
            const setCookies = jest.fn();
            const ctx = {
                ezMasterConfig: {
                    userAuth: {
                        username: 'user',
                        password: 'secret',
                        active: true,
                    },
                    contributorAuth: {
                        username: 'contributor',
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
                cookies: {
                    set: setCookies,
                },
            };
            await login(expDate)(ctx);
            expect(ctx.status).toBe(401);
            expect(setCookies).not.toHaveBeenCalled();
        });

        it('should set ctx.status to 401, if ctx.body.password do not match with config', async () => {
            const setCookies = jest.fn();
            const ctx = {
                ezMasterConfig: {
                    userAuth: {
                        username: 'user',
                        password: 'secret',
                        active: true,
                    },
                    contributorAuth: {
                        username: 'contributor',
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
                cookies: {
                    set: setCookies,
                },
            };
            await login(expDate)(ctx);
            expect(ctx.status).toBe(401);
            expect(setCookies).not.toHaveBeenCalled();
        });

        it('should return header token and set cookie with cookie token for user when password and user name match userAuth config and userAuth is active', async () => {
            const setCookies = jest.fn();
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
                    set: setCookies,
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
            expect(setCookies).toHaveBeenCalledWith(
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
            );
        });
    });

    describe('contributor authentication', () => {
        it('should set ctx.status to 401, if contributor auth is not active', async () => {
            const setCookies = jest.fn();
            const ctx = {
                configTenant: {
                    userAuth: {
                        username: 'user',
                        password: 'secret',
                        active: true,
                    },
                    contributorAuth: {
                        username: 'contributor',
                        password: 'secret',
                        active: false,
                    },
                },
                ezMasterConfig: {
                    rootAuth: {
                        username: 'root',
                        password: 'secret',
                    },
                },
                tenantCollection: {
                    findOneByName: () => ({
                        username: 'admin',
                        password: 'secret',
                    }),
                },
                cookies: {
                    set: setCookies,
                },
                tenant: 'default',
                request: {
                    body: {
                        username: 'contributor',
                        password: `secret`,
                    },
                },
            };
            await login(expDate)(ctx);
            expect(ctx.status).toBe(401);
            expect(setCookies).not.toHaveBeenCalled();
        });
        it('should set ctx.status to 401, if ctx.body.username do not match with userAuth config', async () => {
            const setCookies = jest.fn();
            const ctx = {
                ezMasterConfig: {
                    userAuth: {
                        username: 'user',
                        password: 'secret',
                        active: true,
                    },
                    contributorAuth: {
                        username: 'contributor',
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
                        username: 'not contributor',
                        password: 'secret',
                    },
                },
                cookies: {
                    set: setCookies,
                },
            };
            await login(expDate)(ctx);
            expect(ctx.status).toBe(401);
            expect(setCookies).not.toHaveBeenCalled();
        });

        it('should set ctx.status to 401, if ctx.body.password do not match with config', async () => {
            const setCookies = jest.fn();
            const ctx = {
                ezMasterConfig: {
                    userAuth: {
                        username: 'user',
                        password: 'secret',
                        active: true,
                    },
                    contributorAuth: {
                        username: 'contributor',
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
                        username: 'contributor',
                        password: `not secret`,
                    },
                },
                cookies: {
                    set: setCookies,
                },
            };
            await login(expDate)(ctx);
            expect(ctx.status).toBe(401);
            expect(setCookies).not.toHaveBeenCalled();
        });

        it('should return header token and set cookie with cookie token for user when password and user name match userAuth config and userAuth is active', async () => {
            const setCookies = jest.fn();
            const ctx = {
                configTenant: {
                    userAuth: {
                        username: 'user',
                        password: 'secret',
                        active: true,
                    },
                    contributorAuth: {
                        username: 'contributor',
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
                        username: 'contributor',
                        password: 'secret',
                    },
                },
                cookies: {
                    set: setCookies,
                },
            };

            await login(expDate)(ctx);
            expect(ctx.body).toEqual({
                token: jwt.sign(
                    {
                        username: 'contributor',
                        role: 'contributor',
                        exp: Math.ceil(expDate / 1000) + auth.expiresIn,
                    },
                    auth.headerSecret,
                ),
                role: 'contributor',
            });
            expect(setCookies).toHaveBeenCalledWith(
                'lodex_token_default',
                jwt.sign(
                    {
                        username: 'contributor',
                        role: 'contributor',
                        exp: Math.ceil(expDate / 1000) + auth.expiresIn,
                    },
                    auth.cookieSecret,
                ),
                { httpOnly: true },
            );
        });
    });
});
