import jwt from 'jsonwebtoken';
import { auth } from 'config';

import requestServer from './utils/requestServer';
import fixtures from './ssr.json';
import {
    connect,
    clear,
    loadFixtures,
    close,
} from '../../common/tests/fixtures';
import { closeAllWorkerQueues } from '../workers';
import { ADMIN_ROLE, DEFAULT_TENANT } from '../../common/tools/tenantTools';

const adminHeader = {
    cookie: `lodex_token_${DEFAULT_TENANT}=${jwt.sign(
        {
            username: 'admin',
            role: ADMIN_ROLE,
        },
        auth.cookieSecret,
    )}`,
    Authorization: `Bearer ${jwt.sign(
        {
            username: 'admin',
            role: ADMIN_ROLE,
        },
        auth.headerSecret,
    )}`,
    headers: {
        'X-Lodex-Tenant': DEFAULT_TENANT,
    },
};

const userHeader = {
    cookie: `lodex_token_${DEFAULT_TENANT}=${jwt.sign(
        {
            username: 'user',
            role: 'user',
        },
        auth.cookieSecret,
    )}`,
    Authorization: `Bearer ${jwt.sign(
        {
            username: 'user',
            role: 'user',
        },
        auth.headerSecret,
    )}`,
    headers: {
        'X-Lodex-Tenant': DEFAULT_TENANT,
    },
};

describe('e2e publishedDataset Authentication', () => {
    let server;

    beforeAll(async () => {
        server = requestServer();
        await clear();
        await connect();
        await loadFixtures(fixtures);
    });

    describe('GET /removed', () => {
        it('should return 200 status with admin header', async () => {
            const response = await server.get(
                '/api/publishedDataset/removed',
                adminHeader,
            );

            expect(response.status).toBe(200);
        });

        it('should return 200 if user header', async () => {
            const response = await server.get(
                '/api/publishedDataset/removed',
                userHeader,
            );

            expect(response.status).toBe(200);
        });

        it('should return 401 if no auth header', async () => {
            const response = await server.get('/api/publishedDataset/removed');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /', () => {
        it('should return 200 status with admin header', async () => {
            const response = await server.get(
                '/api/publishedDataset/',
                adminHeader,
            );

            expect(response.status).toBe(200);
        });

        it('should return 200 if user header', async () => {
            const response = await server.get(
                '/api/publishedDataset/',
                userHeader,
            );

            expect(response.status).toBe(200);
        });

        it('should return 401 if no auth header', async () => {
            const response = await server.get('/api/publishedDataset/');

            expect(response.status).toBe(401);
        });
    });

    describe('PUT /add_field', () => {
        it('should return 200 status with admin header', async () => {
            const response = await server.put(
                '/api/publishedDataset/add_field',
                {
                    uri: '4',
                    contributor: 'thiery@marmelab.com',
                    field: { name: 'new' },
                },
                adminHeader,
            );

            expect(response.status).toBe(200);
        });

        it('should return 200 if user header', async () => {
            const response = await server.put(
                '/api/publishedDataset/add_field',
                {
                    uri: '4',
                    contributor: 'thiery@marmelab.com',
                    field: { name: 'new' },
                },
                userHeader,
            );

            expect(response.status).toBe(200);
        });

        it('should return 401 if no auth header', async () => {
            const response = await server.put(
                '/api/publishedDataset/add_field',
                {
                    uri: '4',
                    contributor: 'thiery@marmelab.com',
                    field: { name: 'new' },
                },
            );
            expect(response.status).toBe(401);
        });
    });

    describe('GET /ark', () => {
        it('should return 200 status with admin header', async () => {
            const response = await server.get(
                '/api/publishedDataset/ark?uri=4',
                adminHeader,
            );

            expect(response.status).toBe(200);
        });

        it('should return 200 if user header', async () => {
            const response = await server.get(
                '/api/publishedDataset/ark?uri=4',
                userHeader,
            );

            expect(response.status).toBe(200);
        });

        it('should return 401 if no auth header', async () => {
            const response = await server.get(
                '/api/publishedDataset/ark?uri=4',
            );
            expect(response.status).toBe(401);
        });
    });

    describe('POST /', () => {
        it('should return status 200', async () => {
            const response = await server.post(
                '/api/publishedDataset',
                {
                    fullName: 'Gandalf',
                    email: 'gandalf@whitespire.com',
                },
                adminHeader,
            );

            expect(response.status).toBe(200);
        });

        it('should return 401 status if userHeader', async () => {
            const response = await server.post(
                '/api/publishedDataset',
                {
                    fullName: 'Gandalf',
                    email: 'gandalf@whitespire.com',
                },
                userHeader,
            );

            expect(response.status).toBe(401);
        });

        it('should return 401 if not authenticated', async () => {
            const response = await server.post('/api/publishedDataset', {
                fullName: 'Gandalf',
                email: 'gandalf@whitespire.com',
            });

            expect(response.status).toBe(401);
        });
    });

    describe('PUT /', () => {
        it('should return 200 status with admin header', async () => {
            const response = await server.put(
                '/api/publishedDataset',
                {
                    resource: {
                        uri: '4',
                        fullname: 'FRODO.BAGGINS',
                        email: 'frodo@gondor.net',
                    },
                    field: {
                        name: 'email',
                    },
                },
                adminHeader,
            );

            expect(response.status).toBe(200);
        });

        it('should return 401 if user header', async () => {
            const response = await server.put('/api/publishedDataset', {
                resource: {
                    uri: '4',
                    fullname: 'FRODO.BAGGINS',
                    email: 'frodo@gondor.net',
                },
                field: {
                    name: 'email',
                },
                userHeader,
            });

            expect(response.status).toBe(401);
        });

        it('should return 401 if no auth header', async () => {
            const response = await server.put('/api/publishedDataset', {
                resource: {
                    uri: '4',
                    fullname: 'FRODO.BAGGINS',
                    email: 'frodo@gondor.net',
                },
                field: {
                    name: 'email',
                },
            });

            expect(response.status).toBe(401);
        });
    });

    describe('PUT /restore', () => {
        it('should return 200 status with admin header', async () => {
            const response = await server.put(
                '/api/publishedDataset/restore',
                {
                    uri: '4',
                },
                adminHeader,
            );

            expect(response.status).toBe(200);
        });

        it('should return 401 if user header', async () => {
            const response = await server.put(
                '/api/publishedDataset/restore',
                {
                    uri: '4',
                },
                userHeader,
            );

            expect(response.status).toBe(401);
        });

        it('should return 401 if no auth header', async () => {
            const response = await server.put('/api/publishedDataset/restore', {
                uri: '4',
            });

            expect(response.status).toBe(401);
        });
    });

    describe('DEL /', () => {
        it('should return 200 status with admin header', async () => {
            const response = await server.del(
                '/api/publishedDataset',
                {
                    uri: '4',
                    reason: 'reason',
                },
                adminHeader,
            );

            expect(response.status).toBe(200);
        });

        it('should return 401 if user header', async () => {
            const response = await server.del(
                '/api/publishedDataset',
                {
                    uri: '4',
                    reason: 'reason',
                },
                userHeader,
            );

            expect(response.status).toBe(401);
        });

        it('should return 401 if no auth header', async () => {
            const response = await server.del('/api/publishedDataset', {
                uri: '4',
                reason: 'reason',
            });

            expect(response.status).toBe(401);
        });
    });

    describe('GET /:status', () => {
        it('should return 200 status with admin header', async () => {
            const response = await server.get(
                '/api/publishedDataset/proposed',
                adminHeader,
            );

            expect(response.status).toBe(200);
        });

        it('should return 401 if user header', async () => {
            const response = await server.get(
                '/api/publishedDataset/proposed',
                userHeader,
            );

            expect(response.status).toBe(401);
        });

        it('should return 401 if no auth header', async () => {
            const response = await server.get('/api/publishedDataset/proposed');

            expect(response.status).toBe(401);
        });
    });

    describe('PUT /:uri/change_contribution_status/:name/:status', () => {
        it('should return 200 status with admin header', async () => {
            const response = await server.get(
                '/api/publishedDataset/4/change_contribution_status/email/contributed',
                adminHeader,
            );

            expect(response.status).toBe(404);
        });

        it('should return 401 if user header', async () => {
            const response = await server.get(
                '/api/publishedDataset/4/change_contribution_status/email/contributed',
                userHeader,
            );

            expect(response.status).toBe(401);
        });

        it('should return 401 if no auth header', async () => {
            const response = await server.get(
                '/api/publishedDataset/4/change_contribution_status/email/contributed',
            );

            expect(response.status).toBe(401);
        });
    });

    afterAll(async () => {
        await closeAllWorkerQueues();
        server.close();
        await clear();
        await close();
    });
});
