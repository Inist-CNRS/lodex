import type Koa from 'koa';
import { mongoClientFactory } from './repositoryMiddleware';

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
        ]);
    });
});
