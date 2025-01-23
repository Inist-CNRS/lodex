import countNotUnique, { countUniqueConcatenation } from './countNotUnique';

describe('countNotUnique', () => {
    it('should call collection.count and collection.distinct, and return distinct.length === count', async () => {
        const aggregateResult = {
            toArray: jest
                .fn()
                .mockImplementation(() => [
                    { distinct: 'result1' },
                    { distinct: 'result2' },
                ]),
        };

        const collection = {
            count: jest.fn().mockImplementation(() => Promise.resolve(2)),
            aggregate: jest.fn().mockImplementation(() => aggregateResult),
        };
        expect(await countNotUnique(collection)('fieldName')).toBe(0);

        expect(collection.count).toHaveBeenCalled();
        expect(collection.aggregate).toHaveBeenCalled();
    });

    describe('countUniqueConcatenation', () => {
        it('should call aggregate with properly formed request', async () => {
            const aggregateResult = {
                toArray: jest
                    .fn()
                    .mockImplementation(() => [{ distinct: 'result' }]),
            };
            const collection = {
                aggregate: jest.fn().mockImplementation(() => aggregateResult),
            };
            expect(
                await countUniqueConcatenation(collection)([
                    'field1',
                    'field2',
                    'field3',
                ]),
            ).toBe('result');

            expect(collection.aggregate).toHaveBeenCalledWith([
                {
                    $project: {
                        uri: { $concat: ['$field1', '$field2', '$field3'] },
                    },
                },
                { $group: { _id: null, uris: { $addToSet: '$uri' } } },
                { $project: { distinct: { $size: '$uris' } } },
            ]);
        });
    });
});
