import expect, { createSpy } from 'expect';

import publishedDataset from './publishedDataset';
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
        const toArray = createSpy().andReturn('result');
        const limit = createSpy().andReturn({ toArray });
        const skip = createSpy().andReturn({ limit });
        const sort = createSpy().andReturn({ skip });
        const find = createSpy().andReturn({ sort, skip });
        const db = {
            collection: () => ({ find }),
        };
        const publishedDatasetCollection = publishedDataset(db);

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
            await publishedDatasetCollection.findPage('page', 'perPage', 'match', {}, []);
            expect(find).toHaveBeenCalledWith({
                removedAt: { $exists: false },
            });
        });

        it('should call sort with sortBy: 1 if sortDir is ASC', async () => {
            await publishedDatasetCollection.findPage(5, 2, 'field', 'ASC', 'match', []);
            expect(sort).toHaveBeenCalledWith({ field: 1 });
        });

        it('should call sort with sortBy: -1 if sortDir is DESC', async () => {
            await publishedDatasetCollection.findPage(5, 2, 'field', 'DESC', 'match', []);
            expect(sort).toHaveBeenCalledWith({ field: -1 });
        });

        it('should call skip with page * perPage', async () => {
            await publishedDatasetCollection.findPage(5, 2, null, null, 'match', {}, []);
            expect(skip).toHaveBeenCalledWith(10);
        });

        it('should call limit with perPage', async () => {
            await publishedDatasetCollection.findPage('page', 'perPage', null, null, 'match', {}, []);
            expect(limit).toHaveBeenCalledWith('perPage');
        });
    });
});
