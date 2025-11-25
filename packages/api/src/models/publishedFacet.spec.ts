import publishedFacetFactory from './publishedFacet';
import type { Db } from 'mongodb';

describe('publishedFacet model', () => {
    const collection = {
        countDocuments: jest.fn(),
        find: jest.fn().mockImplementation(() => ({
            skip: () => ({
                limit: () => ({
                    sort: () => ({
                        toArray: () => Promise.resolve([]),
                    }),
                }),
            }),
        })),
        insertMany: jest.fn(),
    };
    const listCollections = {
        toArray: () => Promise.resolve([true]),
    };
    const db = {
        collection: jest.fn().mockReturnValue(collection),
        listCollections: jest.fn().mockReturnValue(listCollections),
        databaseName: 'test',
        options: {},
    } as unknown as Db;

    beforeEach(() => {
        jest.clearAllMocks();
    });

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
                    value: {
                        $regex: '.*f[iìíîïīĭįı][lĺļľłŀ][tţťŧ][eèéêëēĕėęě][rŕŗř].*',
                        $options: 'i',
                    },
                });
            });
        });

        describe('with empty or whitespace filter', () => {
            it('ignores empty filter', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.findValuesForField({
                    field: 'foo',
                    filter: '',
                });

                expect(collection.find).toHaveBeenCalledWith({ field: 'foo' });
            });

            it('ignores whitespace-only filter', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.findValuesForField({
                    field: 'foo',
                    filter: '   ',
                });

                expect(collection.find).toHaveBeenCalledWith({ field: 'foo' });
            });
        });
    });

    describe('countValuesForField', () => {
        describe('without filter', () => {
            it('calls collection.countDocuments with correct parameters', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.countValuesForField('foo');

                expect(collection.countDocuments).toHaveBeenCalledWith({
                    field: 'foo',
                });
            });
        });
        describe('with filter', () => {
            it('calls collection.countDocuments with correct parameters', async () => {
                const publishedFacet = await publishedFacetFactory(db);

                await publishedFacet.countValuesForField('foo', 'filter');

                expect(collection.countDocuments).toHaveBeenCalledWith({
                    field: 'foo',
                    value: {
                        $regex: '.*f[iìíîïīĭįı][lĺļľłŀ][tţťŧ][eèéêëēĕėęě][rŕŗř].*',
                        $options: 'i',
                    },
                });
            });
        });
    });
});
