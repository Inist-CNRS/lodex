import publishedDataset from './publishedDataset';
import { VALIDATED, PROPOSED } from '../../common/propositionStatus';

describe('publishedDataset', () => {
    describe('addVersion', () => {
        const collection = {
            createIndex: jest.fn(),
            findOneAndUpdate: jest.fn(),
        };
        const db = {
            collection: () => collection,
        };
        let publishedDatasetCollection;

        beforeAll(async () => {
            publishedDatasetCollection = await publishedDataset(db);
        });

        it('should call update', async () => {
            const date = new Date();
            await publishedDatasetCollection.addVersion(
                {
                    uri: 'uri',
                },
                {
                    new: 'version',
                    uri: 'uri',
                },
                date,
            );
            expect(collection.findOneAndUpdate).toHaveBeenCalledWith(
                { uri: 'uri' },
                {
                    $push: {
                        versions: {
                            new: 'version',
                            publicationDate: date,
                        },
                    },
                },
                {
                    returnOriginal: false,
                },
            );
        });
    });

    describe('addFieldToResource', () => {
        const previousResource = {
            uri: 'uri',
            versions: [
                {
                    field: 'value',
                },
            ],
        };
        const collection = {
            findOne: jest.fn().mockImplementation(() => previousResource),
            update: jest.fn(),
            createIndex: jest.fn(),
        };
        const db = {
            collection: () => collection,
        };

        let publishedDatasetCollection;

        beforeAll(async () => {
            publishedDatasetCollection = await publishedDataset(db);
        });

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
                await publishedDatasetCollection.addFieldToResource(
                    'uri',
                    contributor,
                    field,
                    true,
                    date,
                );

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
                await publishedDatasetCollection.addFieldToResource(
                    'uri',
                    contributor,
                    field,
                    false,
                    date,
                );

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
            toArray: jest
                .fn()
                .mockImplementation(() => [{ status: previousStatus }]),
        };
        const collection = {
            aggregate: jest.fn().mockImplementation(() => aggregateResult),
            update: jest.fn(),
            createIndex: jest.fn(),
        };
        const db = {
            collection: () => collection,
        };

        let publishedDatasetCollection;

        beforeAll(async () => {
            publishedDatasetCollection = await publishedDataset(db);
        });

        it('should call aggregate incorporating uri and name', async () => {
            await publishedDatasetCollection.changePropositionStatus(
                'uri',
                'name',
                'status',
            );
            expect(collection.aggregate).toHaveBeenCalledWith([
                { $match: { uri: 'uri' } },
                { $unwind: '$contributions' },
                { $match: { 'contributions.fieldName': 'name' } },
                { $project: { _id: 0, status: '$contributions.status' } },
            ]);
        });

        it('should call update to increment received status and decrement previous status', async () => {
            await publishedDatasetCollection.changePropositionStatus(
                'uri',
                'name',
                'status',
            );
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

    describe('findPage', () => {
        const count = jest.fn().mockImplementation(() => 'count');
        const toArray = jest.fn().mockImplementation(() => 'result');
        const limit = jest.fn().mockImplementation(() => ({
            toArray,
        }));
        const skip = jest.fn().mockImplementation(() => ({
            limit,
        }));
        const sort = jest.fn().mockImplementation(() => ({
            skip,
            count,
        }));
        const find = jest.fn().mockImplementation(() => ({
            sort,
            skip,
            count,
        }));
        const db = {
            collection: () => ({
                find,
                createIndex: jest.fn(),
            }),
        };

        let publishedDatasetCollection;

        beforeAll(async () => {
            publishedDatasetCollection = await publishedDataset(db);
        });

        it('should return total and data', async () => {
            const result = await publishedDatasetCollection.findPage({
                perPage: 'perPage',
                page: 'page',
            });
            expect(result).toEqual({
                data: 'result',
                total: 'count',
            });
        });

        it('should call find with removedAt false', async () => {
            await publishedDatasetCollection.findPage({
                perPage: 'perPage',
                page: 'page',
            });
            expect(find).toHaveBeenCalledWith({
                removedAt: { $exists: false },
            });
        });

        it('should call find with removedAt false and $regex on each fields if provided', async () => {
            await publishedDatasetCollection.findPage({
                perPage: 'perPage',
                page: 'page',
                match: 'match',
                searchableFieldNames: ['field1', 'field2'],
            });
            expect(find).toHaveBeenCalledWith({
                removedAt: { $exists: false },
                $or: [
                    { $text: { $search: 'match' } },
                    { 'versions.field1': { $regex: /match/, $options: 'i' } },
                    { 'versions.field2': { $regex: /match/, $options: 'i' } },
                ],
            });
        });

        it('should call find with removedAt false and facets if provided', async () => {
            await publishedDatasetCollection.findPage({
                perPage: 'perPage',
                page: 'page',
                match: 'match',
                facets: { field1: 'field1value' },
                facetFieldNames: ['field1', 'field2'],
            });
            expect(find).toHaveBeenCalledWith({
                removedAt: { $exists: false },
                $and: [{ 'versions.field1': 'field1value' }],
            });
        });

        it('should ignore match if no fields provided', async () => {
            await publishedDatasetCollection.findPage({
                page: 'page',
                perPage: 'perPage',
                match: 'match',
                facetFieldNames: [],
            });
            expect(find).toHaveBeenCalledWith({
                removedAt: { $exists: false },
            });
        });

        it('should call sort with sortBy: 1 if sortDir is ASC', async () => {
            await publishedDatasetCollection.findPage({
                perPage: 5,
                page: 2,
                sortBy: 'field',
                sortDir: 'ASC',
            });
            expect(sort).toHaveBeenCalledWith({ 'versions.field': 1 });
        });

        it('should call sort with sortBy: -1 if sortDir is DESC', async () => {
            await publishedDatasetCollection.findPage({
                perPage: 5,
                page: 2,
                sortBy: 'field',
                sortDir: 'DESC',
            });
            expect(sort).toHaveBeenCalledWith({ 'versions.field': -1 });
        });

        it('should call skip with page * perPage', async () => {
            await publishedDatasetCollection.findPage({
                perPage: 5,
                page: 2,
            });
            expect(skip).toHaveBeenCalledWith(10);
        });

        it('should call limit with perPage', async () => {
            await publishedDatasetCollection.findPage({
                page: 'page',
                perPage: 'perPage',
            });
            expect(limit).toHaveBeenCalledWith('perPage');
        });

        it('should call count', () => {
            expect(count).toHaveBeenCalled();
        });
    });

    describe('create', () => {
        const insertOne = jest.fn().mockImplementation(() => 'inserted');
        const db = {
            collection: () => ({
                insertOne,
                createIndex: jest.fn(),
            }),
        };

        let publishedDatasetCollection;

        beforeAll(async () => {
            publishedDatasetCollection = await publishedDataset(db);
        });

        it('should call connection.insertOne with { uri, versions: [rest] }', async () => {
            const date = new Date();
            const result = await publishedDatasetCollection.create(
                { uri: 'uri', data: 'value' },
                date,
            );
            expect(result).toBe('inserted');

            expect(insertOne).toHaveBeenCalledWith({
                uri: 'uri',
                versions: [
                    {
                        data: 'value',
                        publicationDate: date,
                    },
                ],
            });
        });
    });
});
