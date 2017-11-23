import expect, { createSpy } from 'expect';

import uriDataset from './uriDataset';

describe('uriDataset', () => {
    describe('findLimitFromSkip', () => {
        const toArray = createSpy().andReturn('result');
        const collection = {
            findOne: createSpy().andReturn({
                _id: 0,
                uri: 1,
                field1: 2,
                field2: 3,
            }),
            aggregate: createSpy().andReturn({ toArray }),
        };
        const db = {
            collection: () => collection,
        };
        const uriDatasetCollection = uriDataset(db);

        it('should create the proper aggregation query', async () => {
            const result = await uriDatasetCollection.findLimitFromSkip(
                'limit',
                'skip',
            );
            expect(result).toBe('result');

            expect(collection.findOne).toHaveBeenCalled();
            expect(collection.aggregate).toHaveBeenCalledWith([
                {
                    $group: {
                        _id: '$uri',
                        uri: { $first: '$uri' },
                        field1: { $first: '$field1' },
                        field2: { $first: '$field2' },
                    },
                },
                { $skip: 'skip' },
                { $limit: 'limit' },
            ]);
            expect(toArray).toHaveBeenCalled();
        });
    });
});
