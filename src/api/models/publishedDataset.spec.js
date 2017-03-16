import expect, { createSpy } from 'expect';

import publishedDataset, {
    addFacetToFilters,
    addMatchToFilters,
    addKeyToFilters,
} from './publishedDataset';
import { VALIDATED, PROPOSED } from '../../common/propositionStatus';

describe('publishedDataset', () => {
    describe('addVersion', () => {
        const collection = {
            update: createSpy(),
        };
        const db = {
            collection: () => collection,
        };
        const publishedDatasetCollection = publishedDataset(db);

        it('should call update', async () => {
            const date = new Date();
            await publishedDatasetCollection.addVersion({
                uri: 'uri',
            }, {
                new: 'version',
                uri: 'uri',
            }, date);
            expect(collection.update).toHaveBeenCalledWith(
                { uri: 'uri' },
                {
                    $push: {
                        versions: {
                            new: 'version',
                            publicationDate: date,
                        },
                    },
                },
            );
        });
    });

    describe('addFieldToResource', () => {
        const previousResource = {
            uri: 'uri',
            versions: [{
                field: 'value',
            }],
        };
        const collection = {
            findOne: createSpy().andReturn(previousResource),
            update: createSpy(),
        };
        const db = {
            collection: () => collection,
        };
        const publishedDatasetCollection = publishedDataset(db);

        describe('isLoggedIn: true', () => {
            it('should call addFieldToResource with uri status validated and increment accepted count', async () => {
                const contributor = {
                    name: 'peregrin took',
                    mail: 'peregrin.took@shire.net',
                };

                const field = {
                    name: 'newField',
                    value: 'newValue',
                };
                const date = new Date();
                await publishedDatasetCollection.addFieldToResource('uri', contributor, field, true, date);

                expect(collection.findOne).toHaveBeenCalledWith({ uri: 'uri' });
                expect(collection.update).toHaveBeenCalledWith(
                    { uri: 'uri' },
                    {
                        $addToSet: {
                            contributions: {
                                fieldName: field.name,
                                contributor,
                                status: VALIDATED,
                            },
                        },
                        $inc: {
                            'contributionCount.VALIDATED': 1,
                        },
                        $push: {
                            versions: {
                                field: 'value',
                                newField: 'newValue',
                                publicationDate: date,
                            },
                        },
                    },
                );
            });
        });

        describe('isLoggedIn: false', () => {
            it('should call addFieldToResource with uri status proposed and increment proposedCount', async () => {
                const contributor = {
                    name: 'peregrin took',
                    mail: 'peregrin.took@shire.net',
                };

                const field = {
                    name: 'newField',
                    value: 'newValue',
                };
                const date = new Date();
                await publishedDatasetCollection.addFieldToResource('uri', contributor, field, false, date);

                expect(collection.findOne).toHaveBeenCalledWith({ uri: 'uri' });
                expect(collection.update).toHaveBeenCalledWith(
                    { uri: 'uri' },
                    {
                        $addToSet: {
                            contributions: {
                                fieldName: field.name,
                                contributor,
                                status: PROPOSED,
                            },
                        },
                        $inc: {
                            'contributionCount.PROPOSED': 1,
                        },
                        $push: {
                            versions: {
                                field: 'value',
                                newField: 'newValue',
                                publicationDate: date,
                            },
                        },
                    },
                );
            });
        });
    });

    describe('changePropositionStatus', () => {
        const previousStatus = 'previousStatus';
        const aggregateResult = {
            toArray: createSpy().andReturn([{ status: previousStatus }]),
        };
        const collection = {
            aggregate: createSpy().andReturn(aggregateResult),
            update: createSpy(),
        };
        const db = {
            collection: () => collection,
        };
        const publishedDatasetCollection = publishedDataset(db);

        it('should call aggregate incorporating uri and name', async () => {
            await publishedDatasetCollection.changePropositionStatus('uri', 'name', 'status');
            expect(collection.aggregate).toHaveBeenCalledWith([
                { $match: { uri: 'uri' } },
                { $unwind: '$contributions' },
                { $match: { 'contributions.fieldName': 'name' } },
                { $project: { _id: 0, status: '$contributions.status' } },
            ]);
        });


        it('should call update to increment received status and decrement previous status', async () => {
            await publishedDatasetCollection.changePropositionStatus('uri', 'name', 'status');
            expect(collection.update).toHaveBeenCalledWith(
                { uri: 'uri', 'contributions.fieldName': 'name' },
                {
                    $set: { 'contributions.$.status': 'status' },
                    $inc: {
                        'contributionCount.status': 1,
                        'contributionCount.previousStatus': -1,
                    },
                },
            );
        });
    });

    describe('getPage', () => {
        const count = createSpy().andReturn('count');
        const toArray = createSpy().andReturn('result');
        const limit = createSpy().andReturn({ toArray });
        const skip = createSpy().andReturn({ limit });
        const sort = createSpy().andReturn({ skip, count });
        const find = createSpy().andReturn({ sort, skip, count });
        const db = {
            collection: () => ({ find }),
        };
        const publishedDatasetCollection = publishedDataset(db);

        it('should return total and data', async () => {
            const result = await publishedDatasetCollection.findPage('perPage', 'page');
            expect(result).toEqual({
                data: 'result',
                total: 'count',
            });
        });

        it('should call find with removedAt false', async () => {
            await publishedDatasetCollection.findPage('perPage', 'page');
            expect(find).toHaveBeenCalledWith({ removedAt: { $exists: false } });
        });

        it('should call find with removedAt false and $regex on each fields if provided', async () => {
            await publishedDatasetCollection.findPage('perPage', 'page', null, null, 'match', {}, ['field1', 'field2']);
            expect(find).toHaveBeenCalledWith({
                removedAt: { $exists: false },
                $or: [
                    { 'versions.field1': { $regex: /match/, $options: 'i' } },
                    { 'versions.field2': { $regex: /match/, $options: 'i' } },
                ],
            });
        });


        it('should call find with removedAt false and facets if provided', async () => {
            await publishedDatasetCollection.findPage(
                'perPage',
                'page',
                null,
                null,
                'match',
                { field1: 'field1value' },
                [],
                ['field1', 'field2'],
            );
            expect(find).toHaveBeenCalledWith({
                removedAt: { $exists: false },
                $and: [
                    { 'versions.field1': 'field1value' },
                ],
            });
        });

        it('should ignore match if no fields provided', async () => {
            await publishedDatasetCollection.findPage('page', 'perPage', null, null, 'match', {}, []);
            expect(find).toHaveBeenCalledWith({
                removedAt: { $exists: false },
            });
        });

        it('should call sort with sortBy: 1 if sortDir is ASC', async () => {
            await publishedDatasetCollection.findPage(5, 2, 'field', 'ASC', 'match', {}, []);
            expect(sort).toHaveBeenCalledWith({ 'versions.field': 1 });
        });

        it('should call sort with sortBy: -1 if sortDir is DESC', async () => {
            await publishedDatasetCollection.findPage(5, 2, 'field', 'DESC', 'match', {}, [], []);
            expect(sort).toHaveBeenCalledWith({ 'versions.field': -1 });
        });

        it('should call skip with page * perPage', async () => {
            await publishedDatasetCollection.findPage(5, 2, null, null, 'match', {}, []);
            expect(skip).toHaveBeenCalledWith(10);
        });

        it('should call limit with perPage', async () => {
            await publishedDatasetCollection.findPage('page', 'perPage', null, null, 'match', {}, []);
            expect(limit).toHaveBeenCalledWith('perPage');
        });

        it('should call count', () => {
            expect(count).toHaveBeenCalled();
        });
    });

    describe('addMatchToFilters', () => {
        it('should add facet to filters', () => {
            const facets = {
                facet: 'value',
                otherFacet: 'other value',
            };
            const facetNames = ['facet', 'otherFacet'];
            expect(addFacetToFilters(facets, facetNames)({
                filter: 'data',
            }))
            .toEqual({
                filter: 'data',
                $and: [
                    { 'versions.facet': 'value' },
                    { 'versions.otherFacet': 'other value' },
                ],
            });
        });

        it('should ignore facet not in facetNames', () => {
            const facets = {
                facet: 'value',
                otherFacet: 'other value',
            };
            const facetNames = ['otherFacet'];
            expect(addFacetToFilters(facets, facetNames)({
                filter: 'data',
            }))
            .toEqual({
                filter: 'data',
                $and: [
                    { 'versions.otherFacet': 'other value' },
                ],
            });
        });

        it('should return filters if no facets', () => {
            const facets = null;
            const facetNames = ['facet', 'otherFacet'];
            expect(addFacetToFilters(facets, facetNames)({
                filter: 'data',
            }))
            .toEqual({
                filter: 'data',
            });
        });

        it('should return filters if no facets names', () => {
            const facets = {
                facet: 'value',
                otherFacet: 'other value',
            };
            const facetNames = null;
            expect(addFacetToFilters(facets, facetNames)({
                filter: 'data',
            }))
            .toEqual({
                filter: 'data',
            });
        });
    });

    describe('addMatchToFilters', () => {
        it('should add match for each searchablefields to filters', () => {
            const match = 'match';
            const searchableFields = ['field1', 'field2'];
            expect(addMatchToFilters(match, searchableFields)({ filter: 'data' }))
            .toEqual({
                filter: 'data',
                $or: [
                    { 'versions.field1': { $regex: /match/, $options: 'i' } },
                    { 'versions.field2': { $regex: /match/, $options: 'i' } },
                ],
            });
        });

        it('should return filters if no match', () => {
            const match = null;
            const searchableFields = ['field1', 'field2'];
            expect(addMatchToFilters(match, searchableFields)({ filter: 'data' }))
            .toEqual({
                filter: 'data',
            });
        });

        it('should return filters if no searchableFields', () => {
            const match = 'match';
            const searchableFields = null;
            expect(addMatchToFilters(match, searchableFields)({ filter: 'data' }))
            .toEqual({
                filter: 'data',
            });
        });
    });

    describe('addKeyToFilters', () => {
        it('should add value at key to filters', () => {
            expect(addKeyToFilters('key', 'value')({
                filter: 'data',
            }))
            .toEqual({
                filter: 'data',
                key: 'value',
            });
        });
        it('should return filters if no values', () => {
            expect(addKeyToFilters('key', null)({
                filter: 'data',
            }))
            .toEqual({
                filter: 'data',
            });
        });
    });
});
