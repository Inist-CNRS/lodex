import expect from 'expect';

import ensureIsUnique, { ensureConcatenationIsUnique } from './ensureIsUnique';

describe('ensureIsUnique', () => {
    it('should call collection.count and collection.distinct, and return distinct.length === count', async () => {
        const collection = {
            count: expect.createSpy().andReturn(Promise.resolve(10)),
            distinct: expect.createSpy().andReturn(Promise.resolve({ length: 10 })),
        };
        expect(await ensureIsUnique(collection)('fieldName'))
            .toEqual(true);

        expect(collection.count).toHaveBeenCalled();
        expect(collection.distinct).toHaveBeenCalled();
    });

    describe('ensureConcatenationIsUnique', () => {
        it('should call aggregate with properly fomed request', async () => {
            const collection = {
                aggregate: expect.createSpy().andReturn(Promise.resolve({ distinct: 'result' })),
            };
            expect(await ensureConcatenationIsUnique(collection)(['field1', 'field2', 'field3']))
                .toEqual('result');

            expect(collection.aggregate).toHaveBeenCalledWith([
                { $project: { uri: { $concat: ['$field1', '$field2', '$field3'] } } },
                { $group: { _id: null, uris: { $addToSet: '$uri' } } },
                { $project: { distinct: { $size: '$uris' } } },
            ]);
        });
    });
});
