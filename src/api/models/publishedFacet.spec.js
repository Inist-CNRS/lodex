import expect, { createSpy } from 'expect';

import publishedFacetFactory from './publishedFacet';

describe('publishedFacet model', () => {
    const collection = {
        count: createSpy(),
        find: createSpy().andReturn({
            skip: () => ({
                limit: () => ({
                    sort: () => ({
                        toArray: () => {},
                    }),
                }),
            }),
        }),
    };
    const db = {
        collection: () => collection,
    };
    const publishedFacet = publishedFacetFactory(db);

    describe('findValuesForField', () => {
        describe('without filter', () => {
            it('calls collection.find with correct parameters', async () => {
                await publishedFacet.findValuesForField('foo');

                expect(collection.find).toHaveBeenCalledWith({ field: 'foo' });
            });
        });
        describe('with filter', () => {
            it('calls collection.find with correct parameters', async () => {
                await publishedFacet.findValuesForField('foo', 'filter');

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
                await publishedFacet.countValuesForField('foo');

                expect(collection.count).toHaveBeenCalledWith({ field: 'foo' });
            });
        });
        describe('with filter', () => {
            it('calls collection.count with correct parameters', async () => {
                await publishedFacet.countValuesForField('foo', 'filter');

                expect(collection.count).toHaveBeenCalledWith({
                    field: 'foo',
                    value: { $regex: '.*filter.*', $options: 'i' },
                });
            });
        });
    });
});
