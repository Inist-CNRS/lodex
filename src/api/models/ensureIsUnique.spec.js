import expect from 'expect';

import ensureIsUnique from './ensureIsUnique';

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
});
