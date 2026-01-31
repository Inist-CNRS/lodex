import { MongoClient } from 'mongodb';
import publishedDataset from './publishedDataset';
import { PropositionStatus } from '@lodex/common';

describe('publishedDataset', () => {
    describe('addVersion', () => {
        const collection = {
            createIndex: jest.fn(),
            findOneAndUpdate: jest.fn(),
        };
        const listCollections = {
            toArray: () => [true],
        };
        const db = {
            collection: () => collection,
            listCollections: () => listCollections,
        };
        let publishedDatasetCollection: any;

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
                { returnDocument: 'after' },
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
            updateOne: jest.fn(),
            createIndex: jest.fn(),
        };
        const listCollections = {
            toArray: () => [true],
        };
        const db = {
            collection: () => collection,
            listCollections: () => listCollections,
        };

        let publishedDatasetCollection: any;

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
                expect(collection.updateOne).toHaveBeenCalledWith(
                    { uri: 'uri' },
                    {
                        $addToSet: {
                            contributions: {
                                fieldName: field.name,
                                contributor,
                                status: PropositionStatus.VALIDATED,
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
                expect(collection.updateOne).toHaveBeenCalledWith(
                    { uri: 'uri' },
                    {
                        $addToSet: {
                            contributions: {
                                fieldName: field.name,
                                contributor,
                                status: PropositionStatus.PROPOSED,
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
            updateOne: jest.fn(),
            createIndex: jest.fn(),
        };
        const listCollections = {
            toArray: () => [true],
        };
        const db = {
            collection: () => collection,
            listCollections: () => listCollections,
        };

        let publishedDatasetCollection: any;

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
            expect(collection.updateOne).toHaveBeenCalledWith(
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
        const count = jest.fn().mockImplementation(() => 1);
        const toArray = jest.fn().mockImplementation(() => ['result']);
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
        const listCollections = {
            toArray: () => [true],
        };
        const db = {
            collection: () => ({
                find,
                createIndex: jest.fn(),
            }),
            listCollections: () => listCollections,
        };

        let publishedDatasetCollection: any;

        beforeEach(async () => {
            publishedDatasetCollection = await publishedDataset(db);
            find.mockClear();
        });

        it('should return total and data', async () => {
            const result = await publishedDatasetCollection.findPage({
                perPage: 'perPage',
                page: 'page',
            });
            expect(result).toEqual({
                data: ['result'],
                total: 1,
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

        it('should be able to do a text-based search', async () => {
            await publishedDatasetCollection.findPage({
                perPage: 'perPage',
                page: 'page',
                match: 'match',
                searchableFieldNames: ['field1', 'field2'],
            });

            expect(find).toHaveBeenCalledWith(
                {
                    removedAt: { $exists: false },
                    $text: { $search: 'match' },
                },
                { score: { $meta: 'textScore' } },
            );
        });

        it('should be able to do a research on filters.resourceUris', async () => {
            await publishedDatasetCollection.findPage({
                perPage: 'perPage',
                page: 'page',
                filters: { resourceUris: ['uri1', 'uri2'] },
            });
            expect(find).toHaveBeenCalledWith({
                removedAt: { $exists: false },
                uri: { $in: ['uri1', 'uri2'] },
            });
        });

        it('should be able to do a research on filters.excludedResourceUris', async () => {
            await publishedDatasetCollection.findPage({
                perPage: 'perPage',
                page: 'page',
                filters: { excludedResourceUris: ['uri1', 'uri2'] },
            });
            expect(find).toHaveBeenCalledWith({
                removedAt: { $exists: false },
                uri: { $nin: ['uri1', 'uri2'] },
            });
        });

        it('should fallback to regex search if text-based search returns nothing', async () => {
            const skipToEmpty = () => ({
                limit: () => ({
                    toArray: () => [],
                }),
            });
            const emptyFind = jest.fn().mockImplementation(() => ({
                sort: () => ({
                    skip: skipToEmpty,
                    count: () => 0,
                }),
                skip: skipToEmpty,
                count,
            }));

            const listCollections = {
                toArray: () => [true],
            };
            publishedDatasetCollection = await publishedDataset({
                collection: () => ({
                    find: emptyFind,
                    createIndex: jest.fn(),
                }),
                listCollections: () => listCollections,
            });

            await publishedDatasetCollection.findPage({
                perPage: 'perPage',
                page: 'page',
                match: 'match',
                searchableFieldNames: ['field1', 'field2'],
            });

            expect(emptyFind).toHaveBeenCalledWith(
                {
                    removedAt: { $exists: false },
                    $text: { $search: 'match' },
                },
                { score: { $meta: 'textScore' } },
            );

            expect(emptyFind).toHaveBeenCalledWith({
                removedAt: { $exists: false },
                $or: [
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
            expect(sort).toHaveBeenCalledWith({ _id: 1, 'versions.field': 1 });
        });

        it('should call sort with sortBy: -1 if sortDir is DESC', async () => {
            await publishedDatasetCollection.findPage({
                perPage: 5,
                page: 2,
                sortBy: 'field',
                sortDir: 'DESC',
            });
            expect(sort).toHaveBeenCalledWith({
                _id: -1,
                'versions.field': -1,
            });
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
        const listCollections = {
            toArray: () => [true],
        };
        const db = {
            collection: () => ({
                insertOne,
                createIndex: jest.fn(),
            }),
            listCollections: () => listCollections,
        };

        let publishedDatasetCollection: any;

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

    describe('findManyByUris', () => {
        let publishedDatasetCollection: any;
        let find: any;
        let toArray: any;

        beforeEach(async () => {
            toArray = jest.fn().mockImplementation(() => ['result']);

            find = jest.fn().mockImplementation(() => ({
                toArray,
            }));
            const listCollections = {
                toArray: () => [true],
            };
            const db = {
                collection: () => ({
                    find,
                    createIndex: jest.fn(),
                }),
                listCollections: () => listCollections,
            };
            publishedDatasetCollection = await publishedDataset(db);
        });

        it('should call find with uri = $in uris', async () => {
            const result = await publishedDatasetCollection.findManyByUris([
                'uri1',
                'uri2',
            ]);

            expect(result).toStrictEqual(['result']);
            expect(find).toHaveBeenCalledWith({
                uri: { $in: ['uri1', 'uri2'] },
            });
            expect(toArray).toHaveBeenCalledWith();
        });
    });

    describe('getFacetsForField', () => {
        const connectionStringURI = process.env.MONGODB_URI_FOR_TESTS as string;
        let connection: any;
        let db: any;

        beforeAll(async () => {
            connection = await MongoClient.connect(connectionStringURI, {});
            db = connection.db();
        });

        afterAll(async () => {
            await connection.close();
        });

        beforeEach(async () => {
            await db.collection('publishedDataset').deleteMany({});
        });

        it('should return facets for a given field', async () => {
            await db.collection('publishedDataset').insertMany([
                {
                    uri: 'uri1',
                    versions: [{ fieldName: 'value1' }],
                },
                {
                    uri: 'uri2',
                    versions: [{ fieldName: 'value2' }],
                },
                {
                    uri: 'uri3',
                    versions: [{ fieldName: 'value1' }],
                },
                {
                    uri: 'uri4',
                    versions: [{ fieldName: 'value3' }],
                },
            ]);
            const publishedDatasetCollection = await publishedDataset(db);

            const result =
                await publishedDatasetCollection.getFacetsForField('fieldName');

            expect(
                result.sort(
                    (
                        a: {
                            value: string;
                        },
                        b: {
                            value: string;
                        },
                    ) => a.value.localeCompare(b.value),
                ),
            ).toStrictEqual([
                {
                    field: 'fieldName',
                    value: 'value1',
                    count: 2,
                },
                {
                    field: 'fieldName',
                    value: 'value2',
                    count: 1,
                },
                {
                    field: 'fieldName',
                    value: 'value3',
                    count: 1,
                },
            ]);
        });

        it('should exclude removed resources', async () => {
            await db.collection('publishedDataset').insertMany([
                {
                    uri: 'uri1',
                    versions: [{ fieldName: 'value1' }],
                    removedAt: new Date(),
                },
                {
                    uri: 'uri2',
                    versions: [{ fieldName: 'value2' }],
                    removedAt: new Date(),
                },
                {
                    uri: 'uri3',
                    versions: [{ fieldName: 'value1' }],
                },
            ]);
            const publishedDatasetCollection = await publishedDataset(db);

            const result =
                await publishedDatasetCollection.getFacetsForField('fieldName');

            expect(
                result.sort(
                    (
                        a: {
                            value: string;
                        },
                        b: {
                            value: string;
                        },
                    ) => a.value.localeCompare(b.value),
                ),
            ).toStrictEqual([
                {
                    field: 'fieldName',
                    value: 'value1',
                    count: 1,
                },
            ]);
        });
    });
});
