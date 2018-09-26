import expect, { createSpy } from 'expect';
import { mongoClientFactory } from './repositoryMiddleware';

describe('mongoClient middleware', () => {
    it('it should add db and collections to ctx', async () => {
        const db = {
            collection: () => ({ createIndex: () => {} }),
        };

        const next = () => Promise.resolve();

        const mongoClientImpl = createSpy().andReturn(db);
        const ctx = {};
        await mongoClientFactory(mongoClientImpl)(ctx, next);

        expect(mongoClientImpl).toHaveBeenCalled();

        expect(Object.keys(ctx)).toEqual([
            'db',
            'dataset',
            'field',
            'publishedCharacteristic',
            'publishedDataset',
            'publishedFacet',
            'uriDataset',
        ]);
    });
});
