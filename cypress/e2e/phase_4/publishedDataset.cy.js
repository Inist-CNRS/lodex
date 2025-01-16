import { teardown } from '../../support/authentication';
import {
    ADMIN_ROLE,
    DEFAULT_TENANT,
} from '../../../src/common/tools/tenantTools';

// @TODO: fix jwt signing in cypress
describe('e2e publishedDataset Authentication', () => {
    let adminHeader;
    let userHeader;
    before(() => {
        adminHeader = {
            cookie: `lodex_token_${DEFAULT_TENANT}=${cy.jwtSign(
                {
                    username: 'admin',
                    role: ADMIN_ROLE,
                },
                'cookie',
            )}`,
            Authorization: `Bearer ${cy.jwtSign(
                {
                    username: 'admin',
                    role: ADMIN_ROLE,
                },
                'header',
            )}`,
            headers: {
                'X-Lodex-Tenant': DEFAULT_TENANT,
            },
        };

        userHeader = {
            cookie: `lodex_token_${DEFAULT_TENANT}=${cy.jwtSign(
                {
                    username: 'user',
                    role: 'user',
                },
                'cookie',
            )}`,
            Authorization: `Bearer ${cy.jwtSign(
                {
                    username: 'user',
                    role: 'user',
                },
                'header',
            )}`,
            headers: {
                'X-Lodex-Tenant': DEFAULT_TENANT,
            },
        };
    });

    describe('GET /removed', () => {
        it('should return 200 status with admin header', async () => {
            const response = await cy.request({
                method: 'GET',
                url: '/api/publishedDataset/removed',
                headers: adminHeader,
            });

            expect(response.status).toBe(200);
        });

        it('should return 200 if user header', async () => {
            const response = await cy.request({
                method: 'GET',
                url: '/api/publishedDataset/removed',
                userHeader,
            });

            expect(response.status).toBe(200);
        });

        it('should return 401 if no auth header', async () => {
            const response = await cy.request(
                'GET',
                '/api/publishedDataset/removed',
            );

            expect(response.status).toBe(401);
        });
    });

    describe('GET /', () => {
        it('should return 200 status with admin header', async () => {
            const response = await cy.request({
                method: 'GET',
                url: '/api/publishedDataset/',
                headers: adminHeader,
            });

            expect(response.status).toBe(200);
        });

        it('should return 200 if user header', async () => {
            const response = await cy.request({
                method: 'GET',
                url: '/api/publishedDataset/',
                headers: userHeader,
            });

            expect(response.status).toBe(200);
        });

        it('should return 401 if no auth header', async () => {
            const response = await cy.request({
                method: 'GET',
                url: '/api/publishedDataset/',
            });

            expect(response.status).toBe(401);
        });
    });

    describe('PUT /add_field', () => {
        it('should return 200 status with admin header', async () => {
            const response = await cy.request({
                method: 'PUT',
                url: '/api/publishedDataset/',
                body: {
                    uri: '4',
                    contributor: 'thiery@marmelab.com',
                    field: { name: 'new' },
                },
                headers: adminHeader,
            });

            expect(response.status).toBe(200);
        });

        it('should return 200 if user header', async () => {
            const response = await cy.request({
                method: 'PUT',
                url: '/api/publishedDataset/',
                body: {
                    uri: '4',
                    contributor: 'thiery@marmelab.com',
                    field: { name: 'new' },
                },
                headers: userHeader,
            });

            expect(response.status).toBe(200);
        });

        it('should return 401 if no auth header', async () => {
            const response = await cy.request({
                method: 'PUT',
                url: '/api/publishedDataset/',
                body: {
                    uri: '4',
                    contributor: 'thiery@marmelab.com',
                    field: { name: 'new' },
                },
            });
            expect(response.status).toBe(401);
        });
    });

    describe('GET /ark', () => {
        it('should return 200 status with admin header', async () => {
            const response = await cy.request({
                method: 'GET',
                url: '/api/publishedDataset/ark?uri=4',
                headers: adminHeader,
            });

            expect(response.status).toBe(200);
        });

        it('should return 200 if user header', async () => {
            const response = await cy.request({
                method: 'GET',
                url: '/api/publishedDataset/ark?uri=4',
                headers: userHeader,
            });

            expect(response.status).toBe(200);
        });

        it('should return 401 if no auth header', async () => {
            const response = await cy.request({
                method: 'GET',
                url: '/api/publishedDataset/ark?uri=4',
            });
            expect(response.status).toBe(401);
        });
    });

    describe('POST /', () => {
        it('should return status 200', async () => {
            const response = await cy.request({
                method: 'POST',
                url: '/api/publishedDataset',
                body: {
                    fullName: 'Gandalf',
                    email: 'gandalf@whitespire.com',
                },
                headers: adminHeader,
            });

            expect(response.status).toBe(200);
        });

        it('should return 401 status if userHeader', async () => {
            const response = await cy.request({
                method: 'POST',
                url: '/api/publishedDataset',
                body: {
                    fullName: 'Gandalf',
                    email: 'gandalf@whitespire.com',
                },
                headers: userHeader,
            });

            expect(response.status).toBe(401);
        });

        it('should return 401 if not authenticated', async () => {
            const response = await cy.request({
                method: 'POST',
                url: '/api/publishedDataset',
                body: {
                    fullName: 'Gandalf',
                    email: 'gandalf@whitespire.com',
                },
            });
            expect(response.status).toBe(401);
        });
    });

    describe('PUT /', () => {
        it('should return 200 status with admin header', async () => {
            const response = await cy.request({
                method: 'PUT',
                url: '/api/publishedDataset',
                body: {
                    resource: {
                        uri: '4',
                        fullname: 'FRODO.BAGGINS',
                        email: 'frodo@gondor.net',
                    },
                    field: {
                        name: 'email',
                    },
                },
                headers: adminHeader,
            });

            expect(response.status).toBe(200);
        });

        it('should return 401 if user header', async () => {
            const response = await cy.request({
                method: 'PUT',
                url: '/api/publishedDataset',
                body: {
                    resource: {
                        uri: '4',
                        fullname: 'FRODO.BAGGINS',
                        email: 'frodo@gondor.net',
                    },
                    field: {
                        name: 'email',
                    },
                },
                headers: userHeader,
            });
            expect(response.status).toBe(401);
        });

        it('should return 401 if no auth header', async () => {
            const response = await cy.request({
                method: 'PUT',
                url: '/api/publishedDataset',
                body: {
                    resource: {
                        uri: '4',
                        fullname: 'FRODO.BAGGINS',
                        email: 'frodo@gondor.net',
                    },
                    field: {
                        name: 'email',
                    },
                },
            });

            expect(response.status).toBe(401);
        });
    });

    describe('PUT /restore', () => {
        it('should return 200 status with admin header', async () => {
            const response = await cy.request({
                method: 'PUT',
                url: '/api/publishedDataset/restore',
                body: {
                    uri: '4',
                },
                headers: adminHeader,
            });

            expect(response.status).toBe(200);
        });

        it('should return 401 if user header', async () => {
            const response = await cy.request({
                method: 'PUT',
                url: '/api/publishedDataset/restore',
                body: {
                    uri: '4',
                },
                headers: userHeader,
            });

            expect(response.status).toBe(401);
        });

        it('should return 401 if no auth header', async () => {
            const response = await cy.request({
                method: 'PUT',
                url: '/api/publishedDataset/restore',
                body: {
                    uri: '4',
                },
            });

            expect(response.status).toBe(401);
        });
    });

    describe('DEL /', () => {
        it('should return 200 status with admin header', async () => {
            const response = await cy.request({
                method: 'DELETE',
                url: '/api/publishedDataset/restore',
                body: {
                    uri: '4',
                    reason: 'reason',
                },
                headers: adminHeader,
            });

            expect(response.status).toBe(200);
        });

        it('should return 401 if user header', async () => {
            const response = await cy.request({
                method: 'DELETE',
                url: '/api/publishedDataset/restore',
                body: {
                    uri: '4',
                    reason: 'reason',
                },
                headers: userHeader,
            });

            expect(response.status).toBe(401);
        });

        it('should return 401 if no auth header', async () => {
            const response = await cy.request({
                method: 'DELETE',
                url: '/api/publishedDataset/restore',
                body: {
                    uri: '4',
                    reason: 'reason',
                },
            });

            expect(response.status).toBe(401);
        });
    });

    describe('GET /:status', () => {
        it('should return 200 status with admin header', async () => {
            const response = await cy.request({
                method: 'GET',
                url: '/api/publishedDataset/proposed',
                headers: adminHeader,
            });

            expect(response.status).toBe(200);
        });

        it('should return 401 if user header', async () => {
            const response = await cy.request({
                method: 'GET',
                url: '/api/publishedDataset/proposed',
                headers: userHeader,
            });

            expect(response.status).toBe(401);
        });

        it('should return 401 if no auth header', async () => {
            const response = await cy.request({
                method: 'GET',
                url: '/api/publishedDataset/proposed',
            });

            expect(response.status).toBe(401);
        });
    });

    describe('PUT /:uri/change_contribution_status/:name/:status', () => {
        it('should return 404 status with admin header', async () => {
            const response = await cy.request({
                method: 'PUT',
                url: '/api/publishedDataset/4/change_contribution_status/email/contributed',
                headers: adminHeader,
            });

            expect(response.status).toBe(404);
        });

        it('should return 401 if user header', async () => {
            const response = await cy.request({
                method: 'PUT',
                url: '/api/publishedDataset/4/change_contribution_status/email/contributed',
                headers: userHeader,
            });

            expect(response.status).toBe(401);
        });

        it('should return 401 if no auth header', async () => {
            const response = await cy.request({
                method: 'PUT',
                url: '/api/publishedDataset/4/change_contribution_status/email/contributed',
            });

            expect(response.status).toBe(401);
        });
    });

    after(() => {
        teardown(true);
    });
});
