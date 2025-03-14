import publishedFacetFactory from './publishedFacet';

describe('publishedFacet model', () => {
    const collection = {
        count: jest.fn(),
        find: jest.fn().mockImplementation(() => ({
            skip: () => ({
                limit: () => ({
                    sort: () => ({
                        toArray: () => {},
                    }),
                }),
            }),
        })),
    };
    const listCollections = {
        toArray: () => [true],
    };
    const db = {
        collection: () => collection,
        listCollections: () => listCollections,
    };
    describe('findValuesForField', () => {
        describe('without filter', () => {
            it('calls collection.find with correct parameters', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.findValuesForField({ field: 'foo' });

                expect(collection.find).toHaveBeenCalledWith({ field: 'foo' });
            });
        });
        describe('with filter', () => {
            it('calls collection.find with correct parameters', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.findValuesForField({
                    field: 'foo',
                    filter: 'filter',
                });

                expect(collection.find).toHaveBeenCalledWith({
                    field: 'foo',
                    value: { $regex: '.*filter.*', $options: 'i' },
                });
            });
        });
    });

    describe('countValuesForField', () => {
        describe('without filter', () => {
            it('calls collection.count with correct parameters', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.countValuesForField('foo');

                expect(collection.count).toHaveBeenCalledWith({ field: 'foo' });
            });
        });
        describe('with filter', () => {
            it('calls collection.count with correct parameters', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.countValuesForField('foo', 'filter');

                expect(collection.count).toHaveBeenCalledWith({
                    field: 'foo',
                    value: { $regex: '.*filter.*', $options: 'i' },
                });
            });
        });
    });
});
