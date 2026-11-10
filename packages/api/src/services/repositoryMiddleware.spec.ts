import type Koa from 'koa';
import mongoClient, { closeDb } from './mongoClient';
import {
    invalidateRepositories,
    mongoClientFactory,
} from './repositoryMiddleware';

describe('mongoClient middleware', () => {
    it('should add db and collections to ctx', async () => {
        const listCollections = {
            toArray: () => [true],
        };
        const db = {
            collection: () => ({ createIndex: () => {} }),
            listCollections: () => listCollections,
        };

        const next = () => Promise.resolve();

        const mongoClientImpl = jest.fn().mockImplementation(() => db);
        const ctx = {} as Koa.Context;
        await mongoClientFactory(mongoClientImpl)(ctx, next);

        expect(mongoClientImpl).toHaveBeenCalled();

        expect(Object.keys(ctx)).toEqual([
            'db',
            'annotation',
            'dataset',
            'field',
            'subresource',
            'enrichment',
            'precomputed',
            'publishedCharacteristic',
            'publishedDataset',
            'publishedFacet',
            'configTenantCollection',
            'hiddenResource',
            'dataSource',
        ]);
    });
});

const tenant = 'repository_cache';

describe('repositoryMiddleware cache', () => {
    afterAll(async () => {
        const db = await mongoClient(tenant);
        await db.dropDatabase();
        await closeDb(tenant);
    });

    it('should build the repositories once per tenant, and again after invalidation', async () => {
        const db = await mongoClient(tenant);
        const listCollections = jest.spyOn(db, 'listCollections');
        const middleware = mongoClientFactory(async () => db);
        const next = async () => {};

        const firstCtx: any = { tenant };
        await middleware(firstCtx, next);
        const callsAfterFirstRequest = listCollections.mock.calls.length;
        expect(callsAfterFirstRequest).toBeGreaterThan(0);
        expect(firstCtx.field).toBeDefined();
        expect(firstCtx.dataSource).toBeDefined();

        const secondCtx: any = { tenant };
        await middleware(secondCtx, next);
        expect(listCollections.mock.calls.length).toBe(callsAfterFirstRequest);
        expect(secondCtx.field).toBe(firstCtx.field);

        // a dropped collection loses its indexes: invalidation must recreate them
        await secondCtx.field.drop();
        invalidateRepositories(tenant);
        await middleware({ tenant } as any, next);
        expect(listCollections.mock.calls.length).toBeGreaterThan(
            callsAfterFirstRequest,
        );
        const indexes = await db.collection('field').indexes();
        expect(indexes.map(({ name }) => name)).toContain('name_1');
    });
});
