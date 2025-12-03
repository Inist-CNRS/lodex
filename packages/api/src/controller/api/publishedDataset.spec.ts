import { MongoClient } from 'mongodb';
import createAnnotationModel from '../../models/annotation';
import createPublishedDatasetModel from '../../models/publishedDataset';
import {
    completeFilters,
    createResource,
    editResource,
    getPage,
    getRemovedPage,
    removeResource,
    restoreResource,
    searchByField,
} from './publishedDataset';

describe('publishedDataset', () => {
    describe('getPage', () => {
        const ctx = {
            publishedDataset: {
                findPage: jest.fn().mockImplementation(() =>
                    Promise.resolve({
                        data: [
                            { uri: 1, versions: [{ v: 1 }, { v: 2 }] },
                            {
                                uri: 2,
                                versions: [{ v: 1 }, { v: 2 }, { v: 3 }],
                            },
                            { uri: 3, versions: [{ v: 1 }] },
                        ],
                        total: 42,
                    }),
                ),
                countAll: jest.fn().mockImplementation(() => 'fullTotal'),
            },
            field: {
                findFacetNames: jest
                    .fn()
                    .mockImplementation(() => ['facet1', 'facet2']),
                findSearchableNames: jest
                    .fn()
                    .mockImplementation(() => ['searchable1', 'searchable2']),
            },
            publishedFacet: {
                findOne: jest.fn().mockImplementation(() => ({
                    _id: '64130aaeb844aa0021b2960f',
                    value: 'facet1value',
                })),
            },
            request: {
                body: {
                    page: 1,
                    perPage: 100,
                    match: 'match',
                    facets: {
                        facet1: ['64130aaeb844aa0021b2960f'],
                    },
                    sort: {},
                    filters: {
                        resourceUris: ['uri1', 'uri2'],
                    },
                },
            },
        };

        it('should call ctx.publishedDataset.findPage', async () => {
            await getPage(ctx);

            expect(ctx.publishedDataset.findPage).toHaveBeenCalledWith({
                page: 1,
                perPage: 100,
                sortBy: undefined,
                sortDir: undefined,
                match: 'match',
                facets: { facet1: ['facet1value'] },
                invertedFacets: [],
                searchableFieldNames: ['searchable1', 'searchable2'],
                facetFieldNames: ['facet1', 'facet2'],
                filters: {
                    resourceUris: ['uri1', 'uri2'],
                },
                excludeSubresources: true,
            });
        });

        it('should call ctx.publishedDataset.count', async () => {
            await getPage(ctx);

            expect(ctx.publishedDataset.countAll).toHaveBeenCalledWith({
                excludeSubresources: true,
            });
        });

        it('should return only the last version of each doc', async () => {
            await getPage(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toEqual({
                data: [
                    { uri: 1, v: 2 },
                    { uri: 2, v: 3 },
                    { uri: 3, v: 1 },
                ],
                total: 42,
                fullTotal: 'fullTotal',
            });
        });
        describe('integration', () => {
            let connection: any;
            let db;
            let annotationModel: any;
            let publishedDatasetModel: any;

            beforeAll(async () => {
                // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
                connection = await MongoClient.connect(process.env.MONGO_URL, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                db = connection.db();
                annotationModel = await createAnnotationModel(db);
                publishedDatasetModel = await createPublishedDatasetModel(db);
            });

            afterAll(async () => {
                await connection.close();
            });

            beforeEach(async () => {
                await annotationModel.deleteMany({});
                await publishedDatasetModel.deleteMany({});
                await publishedDatasetModel.insertBatch([
                    {
                        uri: 'uri1',
                        versions: [
                            {
                                title: 'title1',
                                description: 'description1',
                                details: 'details1',
                            },
                        ],
                    },
                    {
                        uri: 'uri2',
                        versions: [
                            {
                                title: 'title2',
                                description: 'description2',
                                details: 'details2',
                            },
                        ],
                    },
                    {
                        uri: 'uri3',
                        versions: [
                            {
                                title: 'title3',
                                description: 'description3',
                                details: 'details3',
                            },
                        ],
                    },
                    {
                        uri: 'uri4',
                        versions: [
                            {
                                title: 'title4',
                                description: 'description4',
                                details: 'details4',
                            },
                        ],
                    },

                    {
                        uri: 'uri5',
                        versions: [
                            {
                                title: 'title5',
                                description: 'description5',
                                details: 'details5',
                            },
                        ],
                    },

                    {
                        uri: 'uri6',
                        versions: [
                            {
                                title: 'title6',
                                description: 'description6',
                                details: 'details6',
                            },
                        ],
                    },

                    {
                        uri: 'uri7',
                        versions: [
                            {
                                title: 'title7',
                                description: 'description7',
                                details: 'details7',
                            },
                        ],
                    },

                    {
                        uri: 'uri8',
                        versions: [
                            {
                                title: 'title8',
                                description: 'description8',
                                details: 'details8',
                            },
                        ],
                    },

                    {
                        uri: 'uri9',
                        versions: [
                            {
                                title: 'title9',
                                description: 'description9',
                                details: 'details9',
                            },
                        ],
                    },
                ]);
            });

            it('should return paginated publishedDataset', async () => {
                const ctx = {
                    publishedDataset: publishedDatasetModel,
                    field: {
                        findFacetNames: jest.fn().mockImplementation(() => []),
                        findSearchableNames: jest
                            .fn()
                            .mockImplementation(() => []),
                    },
                    request: {
                        body: {
                            page: 0,
                            perPage: 5,
                            match: null,
                            facets: {},
                            sort: {},
                            filters: {},
                        },
                    },
                };

                await getPage(ctx);

                // @ts-expect-error TS(2304): Cannot find name 'expect'.
                expect(ctx.body).toEqual({
                    data: [
                        {
                            uri: 'uri1',
                            title: 'title1',
                            description: 'description1',
                            details: 'details1',
                        },
                        {
                            uri: 'uri2',
                            title: 'title2',
                            description: 'description2',
                            details: 'details2',
                        },
                        {
                            uri: 'uri3',
                            title: 'title3',
                            description: 'description3',
                            details: 'details3',
                        },
                        {
                            uri: 'uri4',
                            title: 'title4',
                            description: 'description4',
                            details: 'details4',
                        },
                        {
                            uri: 'uri5',
                            title: 'title5',
                            description: 'description5',
                            details: 'details5',
                        },
                    ],
                    total: 9,
                    fullTotal: 9,
                });
            });

            it('should support resourceUris filter', async () => {
                const ctx = {
                    publishedDataset: publishedDatasetModel,
                    field: {
                        findFacetNames: jest.fn().mockImplementation(() => []),
                        findSearchableNames: jest
                            .fn()
                            .mockImplementation(() => []),
                    },
                    request: {
                        body: {
                            page: 0,
                            perPage: 5,
                            match: null,
                            facets: {},
                            sort: {},
                            filters: {
                                resourceUris: ['uri1', 'uri2', 'uri3'],
                            },
                        },
                    },
                };

                await getPage(ctx);

                // @ts-expect-error TS(2304): Cannot find name 'expect'.
                expect(ctx.body).toEqual({
                    data: [
                        {
                            uri: 'uri1',
                            title: 'title1',
                            description: 'description1',
                            details: 'details1',
                        },
                        {
                            uri: 'uri2',
                            title: 'title2',
                            description: 'description2',
                            details: 'details2',
                        },
                        {
                            uri: 'uri3',
                            title: 'title3',
                            description: 'description3',
                            details: 'details3',
                        },
                    ],
                    total: 3,
                    fullTotal: 9,
                });
            });

            it('should support excludedResourceUris filter', async () => {
                const ctx = {
                    publishedDataset: publishedDatasetModel,
                    field: {
                        findFacetNames: jest.fn().mockImplementation(() => []),
                        findSearchableNames: jest
                            .fn()
                            .mockImplementation(() => []),
                    },
                    request: {
                        body: {
                            page: 0,
                            perPage: 9,
                            match: null,
                            facets: {},
                            sort: {},
                            filters: {
                                excludedResourceUris: ['uri1', 'uri2', 'uri3'],
                            },
                        },
                    },
                };

                await getPage(ctx);

                // @ts-expect-error TS(2304): Cannot find name 'expect'.
                expect(ctx.body).toEqual({
                    data: [
                        {
                            uri: 'uri4',
                            title: 'title4',
                            description: 'description4',
                            details: 'details4',
                        },
                        {
                            uri: 'uri5',
                            title: 'title5',
                            description: 'description5',
                            details: 'details5',
                        },
                        {
                            uri: 'uri6',
                            title: 'title6',
                            description: 'description6',
                            details: 'details6',
                        },
                        {
                            uri: 'uri7',
                            title: 'title7',
                            description: 'description7',
                            details: 'details7',
                        },
                        {
                            uri: 'uri8',
                            title: 'title8',
                            description: 'description8',
                            details: 'details8',
                        },
                        {
                            uri: 'uri9',
                            title: 'title9',
                            description: 'description9',
                            details: 'details9',
                        },
                    ],
                    total: 6,
                    fullTotal: 9,
                });
            });

            it('should support annotated: true filter', async () => {
                await annotationModel.create({
                    resourceUri: 'uri1',
                    fieldId: 'field1',
                });

                const ctx = {
                    publishedDataset: publishedDatasetModel,
                    field: {
                        findFacetNames: jest.fn().mockImplementation(() => []),
                        findSearchableNames: jest
                            .fn()
                            .mockImplementation(() => []),
                    },
                    annotation: annotationModel,
                    request: {
                        body: {
                            page: 0,
                            perPage: 5,
                            match: null,
                            facets: {},
                            sort: {},
                            filters: {
                                annotated: true,
                            },
                        },
                    },
                };

                await getPage(ctx);

                // @ts-expect-error TS(2304): Cannot find name 'expect'.
                expect(ctx.body).toEqual({
                    data: [
                        {
                            uri: 'uri1',
                            title: 'title1',
                            description: 'description1',
                            details: 'details1',
                        },
                    ],
                    total: 1,
                    fullTotal: 9,
                });
            });

            it('should support annotated: false filter', async () => {
                await annotationModel.create({
                    resourceUri: 'uri1',
                    fieldId: 'field1',
                });

                const ctx = {
                    publishedDataset: publishedDatasetModel,
                    field: {
                        findFacetNames: jest.fn().mockImplementation(() => []),
                        findSearchableNames: jest
                            .fn()
                            .mockImplementation(() => []),
                    },
                    annotation: annotationModel,
                    request: {
                        body: {
                            page: 0,
                            perPage: 9,
                            match: null,
                            facets: {},
                            sort: {},
                            filters: {
                                annotated: false,
                            },
                        },
                    },
                };

                await getPage(ctx);

                // @ts-expect-error TS(2304): Cannot find name 'expect'.
                expect(ctx.body).toEqual({
                    data: [
                        {
                            uri: 'uri2',
                            title: 'title2',
                            description: 'description2',
                            details: 'details2',
                        },
                        {
                            uri: 'uri3',
                            title: 'title3',
                            description: 'description3',
                            details: 'details3',
                        },
                        {
                            uri: 'uri4',
                            title: 'title4',
                            description: 'description4',
                            details: 'details4',
                        },
                        {
                            uri: 'uri5',
                            title: 'title5',
                            description: 'description5',
                            details: 'details5',
                        },
                        {
                            uri: 'uri6',
                            title: 'title6',
                            description: 'description6',
                            details: 'details6',
                        },
                        {
                            uri: 'uri7',
                            title: 'title7',
                            description: 'description7',
                            details: 'details7',
                        },
                        {
                            uri: 'uri8',
                            title: 'title8',
                            description: 'description8',
                            details: 'details8',
                        },
                        {
                            uri: 'uri9',
                            title: 'title9',
                            description: 'description9',
                            details: 'details9',
                        },
                    ],
                    total: 8,
                    fullTotal: 9,
                });
            });
        });
    });

    describe('searchByField', () => {
        let connection: MongoClient;
        let db;
        let publishedDatasetModel: Awaited<
            ReturnType<typeof createPublishedDatasetModel>
        >;

        beforeAll(async () => {
            // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
            connection = await MongoClient.connect(process.env.MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            db = connection.db();
            publishedDatasetModel = await createPublishedDatasetModel(db);
        });

        afterAll(async () => {
            await connection.close();
        });

        beforeEach(async () => {
            await publishedDatasetModel.deleteMany({});
        });

        it('should return 400 when request body is invalid', async () => {
            const ctx = {
                publishedDataset: publishedDatasetModel,
                request: {
                    body: {
                        invalidField: 'invalid',
                        page: 'not a number',
                    },
                },
            } as any;

            await searchByField(ctx);

            expect(ctx.status).toBe(400);
            expect(ctx.body).toEqual({
                error: 'invalid_request',
            });
        });

        it.each([
            {
                testName: 'should return resources matching string field value',
                filters: [{ fieldName: 'tags', value: 'javascript' }],
                testData: [
                    {
                        uri: 'uri1',
                        versions: [{ name: 'Resource 1', tags: 'javascript' }],
                    },
                    {
                        uri: 'uri2',
                        versions: [{ name: 'Resource 2', tags: 'python' }],
                    },
                ],
                expectedTotal: 1,
                expectedData: [{ uri: 'uri1', tags: 'javascript' }],
            },
            {
                testName:
                    'should return resources matching string[] field value',
                filters: [
                    { fieldName: 'tags', value: ['javascript', 'python'] },
                ],
                testData: [
                    {
                        uri: 'uri1',
                        versions: [{ name: 'Resource 1', tags: 'javascript' }],
                    },
                    {
                        uri: 'uri2',
                        versions: [{ name: 'Resource 2', tags: 'java' }],
                    },
                    {
                        uri: 'uri3',
                        versions: [{ name: 'Resource 3', tags: 'python' }],
                    },
                ],
                expectedTotal: 2,
                expectedData: [
                    { uri: 'uri1', tags: 'javascript' },
                    { uri: 'uri3', tags: 'python' },
                ],
            },
            {
                testName:
                    'should return resources matching value in string array field',
                filters: [{ fieldName: 'cats', value: 'tech' }],
                testData: [
                    {
                        uri: 'uri1',
                        versions: [{ cats: ['tech', 'web'] }],
                    },
                    {
                        uri: 'uri2',
                        versions: [{ cats: ['web', 'frontend'] }],
                    },
                ],
                expectedTotal: 1,
                expectedData: [{ uri: 'uri1', cats: ['tech', 'web'] }],
            },
            {
                testName:
                    'should return resources matching value in string[][] field',
                filters: [{ fieldName: 'matr', value: 'a' }],
                testData: [
                    {
                        uri: 'uri1',
                        versions: [
                            {
                                matr: [
                                    ['a', 'b'],
                                    ['c', 'd'],
                                ],
                            },
                        ],
                    },
                    {
                        uri: 'uri2',
                        versions: [
                            {
                                matr: [
                                    ['e', 'f'],
                                    ['g', 'h'],
                                ],
                            },
                        ],
                    },
                ],
                expectedTotal: 1,
                expectedData: [
                    {
                        uri: 'uri1',
                        matr: [
                            ['a', 'b'],
                            ['c', 'd'],
                        ],
                    },
                ],
            },
            {
                testName: 'should find value in nested arrays (string[][])',
                filters: [{ fieldName: 'matr', value: 'h' }],
                testData: [
                    {
                        uri: 'uri1',
                        versions: [
                            {
                                matr: [
                                    ['a', 'b'],
                                    ['c', 'd'],
                                ],
                            },
                        ],
                    },
                    {
                        uri: 'uri2',
                        versions: [
                            {
                                matr: [
                                    ['e', 'f'],
                                    ['g', 'h'],
                                ],
                            },
                        ],
                    },
                ],
                expectedTotal: 1,
                expectedData: [
                    {
                        uri: 'uri2',
                        matr: [
                            ['e', 'f'],
                            ['g', 'h'],
                        ],
                    },
                ],
            },
            {
                testName: 'should support multiple filters (AND logic)',
                filters: [
                    { fieldName: 'tags', value: 'javascript' },
                    { fieldName: 'name', value: 'Resource 1' },
                ],
                testData: [
                    {
                        uri: 'uri1',
                        versions: [{ name: 'Resource 1', tags: 'javascript' }],
                    },
                    {
                        uri: 'uri2',
                        versions: [{ name: 'Resource 2', tags: 'javascript' }],
                    },
                    {
                        uri: 'uri3',
                        versions: [{ name: 'Resource 1', tags: 'python' }],
                    },
                ],
                expectedTotal: 1,
                expectedData: [
                    { uri: 'uri1', name: 'Resource 1', tags: 'javascript' },
                ],
            },
        ])(
            '$testName',
            async ({ filters, testData, expectedTotal, expectedData }) => {
                await publishedDatasetModel.insertBatch(testData);

                const ctx = {
                    publishedDataset: publishedDatasetModel,
                    request: {
                        body: {
                            filters,
                            page: 0,
                            perPage: 10,
                        },
                    },
                } as any;

                await searchByField(ctx);

                expect(ctx.body.total).toBe(expectedTotal);
                expect(ctx.body.data).toHaveLength(expectedTotal);
                expect(ctx.body.data).toEqual(
                    expect.arrayContaining(
                        expectedData.map((data) =>
                            expect.objectContaining(data),
                        ),
                    ),
                );
            },
        );

        it.each([
            {
                testName: 'should support pagination for string field values',
                filters: [{ fieldName: 'tags', value: 'javascript' }],
                perPage: 1,
                testData: [
                    { uri: 'uri1', versions: [{ tags: 'javascript' }] },
                    { uri: 'uri2', versions: [{ tags: 'javascript' }] },
                    { uri: 'uri3', versions: [{ tags: 'python' }] },
                ],
            },
            {
                testName: 'should support pagination for string[] field values',
                filters: [{ fieldName: 'cats', value: 'tech' }],
                perPage: 1,
                testData: [
                    { uri: 'uri1', versions: [{ cats: ['tech', 'web'] }] },
                    { uri: 'uri2', versions: [{ cats: ['tech', 'data'] }] },
                ],
            },
            {
                testName:
                    'should support pagination for string[][] field values',
                filters: [{ fieldName: 'matr', value: 'a' }],
                perPage: 1,
                testData: [
                    {
                        uri: 'uri1',
                        versions: [{ matr: [['a', 'b']] }],
                    },
                    {
                        uri: 'uri2',
                        versions: [{ matr: [['a', 'c']] }],
                    },
                ],
            },
        ])('$testName', async ({ filters, perPage, testData }) => {
            await publishedDatasetModel.insertBatch(testData);

            const ctx = {
                publishedDataset: publishedDatasetModel,
                request: {
                    body: {
                        filters,
                        page: 0,
                        perPage,
                    },
                },
            } as any;

            await searchByField(ctx);

            const totalResults = ctx.body.total;
            expect(ctx.body.data).toHaveLength(Math.min(perPage, totalResults));

            // Get second page
            ctx.request.body.page = 1;
            await searchByField(ctx);

            expect(ctx.body.total).toBe(totalResults);
            const remainingItems = Math.max(0, totalResults - perPage);
            expect(ctx.body.data).toHaveLength(
                Math.min(perPage, remainingItems),
            );
        });

        it.each([
            {
                testName:
                    'should return empty array when no resources match string value',
                filters: [{ fieldName: 'tags', value: 'nonexistent' }],
                testData: [{ uri: 'uri1', versions: [{ tags: 'python' }] }],
            },
            {
                testName:
                    'should return empty array when no resources match string[] value',
                filters: [{ fieldName: 'cats', value: 'nonexistent' }],
                testData: [
                    { uri: 'uri1', versions: [{ cats: ['tech', 'web'] }] },
                ],
            },
            {
                testName:
                    'should return empty array when no resources match string[][] value',
                filters: [{ fieldName: 'matr', value: 'zzz' }],
                testData: [{ uri: 'uri1', versions: [{ matr: [['a', 'b']] }] }],
            },
        ])('$testName', async ({ filters, testData }) => {
            await publishedDatasetModel.insertBatch(testData);

            const ctx = {
                publishedDataset: publishedDatasetModel,
                request: {
                    body: {
                        filters,
                        page: 0,
                        perPage: 10,
                    },
                },
            } as any;

            await searchByField(ctx);

            expect(ctx.body.total).toBe(0);
            expect(ctx.body.data).toHaveLength(0);
        });

        it.each([
            {
                testName:
                    'should support sorting in ascending order with a filter',
                sortDir: 'ASC' as const,
                expectedFirst: 'Resource 1',
                expectedLast: 'Resource 2',
            },
            {
                testName:
                    'should support sorting in descending order with a filter',
                sortDir: 'DESC' as const,
                expectedFirst: 'Resource 2',
                expectedLast: 'Resource 1',
            },
        ])('$testName', async ({ sortDir, expectedFirst, expectedLast }) => {
            await publishedDatasetModel.insertBatch([
                {
                    uri: 'uri1',
                    versions: [{ name: 'Resource 1', tags: 'javascript' }],
                },
                {
                    uri: 'uri2',
                    versions: [{ name: 'Resource 2', tags: 'javascript' }],
                },
            ]);

            const ctx = {
                publishedDataset: publishedDatasetModel,
                request: {
                    body: {
                        filters: [{ fieldName: 'tags', value: 'javascript' }],
                        page: 0,
                        perPage: 5,
                        sort: {
                            sortBy: 'name',
                            sortDir,
                        },
                    },
                },
            } as any;

            await searchByField(ctx);

            expect(ctx.body.data).toHaveLength(2);
            expect(ctx.body.data[0].name).toBe(expectedFirst);
            expect(ctx.body.data[1].name).toBe(expectedLast);
        });

        it('should return only the latest version of each resource', async () => {
            await publishedDatasetModel.insertBatch([
                {
                    uri: 'uri1',
                    versions: [
                        {
                            name: 'Version 1',
                            tags: 'javascript',
                        },
                        {
                            name: 'Version 2',
                            tags: 'updated',
                        },
                    ],
                },
            ]);

            const ctx = {
                publishedDataset: publishedDatasetModel,
                request: {
                    body: {
                        filters: [{ fieldName: 'tags', value: 'javascript' }],
                        page: 0,
                        perPage: 10,
                    },
                },
            } as any;

            await searchByField(ctx);

            // The query uses versions.0 (first version), but returns the latest version
            // So this finds resources where the FIRST version has tags='javascript'
            // but returns the LATEST version of those resources
            expect(ctx.body.total).toBe(1);
            expect(ctx.body.data[0]).toMatchObject({
                uri: 'uri1',
                name: 'Version 2', // Latest version is returned
                tags: 'updated',
            });
        });

        it('should sort by _id in ASC order by default when no sort is provided', async () => {
            await publishedDatasetModel.insertBatch([
                {
                    uri: 'uri3',
                    versions: [{ name: 'Resource 3', tags: 'javascript' }],
                },
                {
                    uri: 'uri1',
                    versions: [{ name: 'Resource 1', tags: 'javascript' }],
                },
                {
                    uri: 'uri2',
                    versions: [{ name: 'Resource 2', tags: 'javascript' }],
                },
            ]);

            const ctx = {
                publishedDataset: publishedDatasetModel,
                request: {
                    body: {
                        filters: [{ fieldName: 'tags', value: 'javascript' }],
                        page: 0,
                        perPage: 10,
                        // No sort provided, should default to { sortBy: '_id', sortDir: 'ASC' }
                    },
                },
            } as any;

            await searchByField(ctx);

            expect(ctx.body.total).toBe(3);
            expect(ctx.body.data).toHaveLength(3);
            // Results should be sorted by _id in ascending order
            // Since _id is auto-generated by MongoDB in insertion order,
            // we verify that the first result has the smallest _id
            const ids = ctx.body.data.map((d: any) => d._id);
            const sortedIds = [...ids].sort();
            expect(ids).toEqual(sortedIds);
        });

        it('should sort by _id in DESC order when explicitly specified', async () => {
            await publishedDatasetModel.insertBatch([
                {
                    uri: 'uri1',
                    versions: [{ name: 'Resource 1', tags: 'javascript' }],
                },
                {
                    uri: 'uri2',
                    versions: [{ name: 'Resource 2', tags: 'javascript' }],
                },
                {
                    uri: 'uri3',
                    versions: [{ name: 'Resource 3', tags: 'javascript' }],
                },
            ]);

            const ctx = {
                publishedDataset: publishedDatasetModel,
                request: {
                    body: {
                        filters: [{ fieldName: 'tags', value: 'javascript' }],
                        page: 0,
                        perPage: 10,
                        sort: {
                            sortBy: '_id',
                            sortDir: 'DESC',
                        },
                    },
                },
            } as any;

            await searchByField(ctx);

            expect(ctx.body.total).toBe(3);
            expect(ctx.body.data).toHaveLength(3);
            // Results should be sorted by _id in descending order
            const ids = ctx.body.data.map((d: any) => d._id);
            const sortedIdsDesc = [...ids].sort().reverse();
            expect(ids).toEqual(sortedIdsDesc);
        });

        it('should handle empty filters array', async () => {
            await publishedDatasetModel.insertBatch([
                { uri: 'uri1', versions: [{ name: 'Resource 1' }] },
                { uri: 'uri2', versions: [{ name: 'Resource 2' }] },
            ]);

            const ctx = {
                publishedDataset: publishedDatasetModel,
                request: {
                    body: {
                        filters: [],
                        page: 0,
                        perPage: 10,
                    },
                },
            } as any;

            await searchByField(ctx);

            // With no filters, should return all resources
            expect(ctx.body.total).toBe(2);
            expect(ctx.body.data).toHaveLength(2);
        });

        it('should handle missing filters field', async () => {
            await publishedDatasetModel.insertBatch([
                { uri: 'uri1', versions: [{ name: 'Resource 1' }] },
                { uri: 'uri2', versions: [{ name: 'Resource 2' }] },
            ]);

            const ctx = {
                publishedDataset: publishedDatasetModel,
                request: {
                    body: {
                        page: 0,
                        perPage: 10,
                    },
                },
            } as any;

            await searchByField(ctx);

            // With no filters, should return all resources
            expect(ctx.body.total).toBe(2);
            expect(ctx.body.data).toHaveLength(2);
        });
    });

    describe('getRemovedPage', () => {
        const ctx = {
            publishedDataset: {
                findRemovedPage: jest.fn().mockImplementation(() =>
                    Promise.resolve({
                        data: [
                            {
                                uri: 1,
                                versions: [{ v: 1 }, { v: 2 }],
                                reason: 'reason1',
                                removed_at: 'removed_at1',
                            },
                            {
                                uri: 2,
                                versions: [{ v: 1 }, { v: 2 }, { v: 3 }],
                                reason: 'reason2',
                                removed_at: 'removed_at2',
                            },
                            {
                                uri: 3,
                                versions: [{ v: 1 }],
                                reason: 'reason3',
                                removed_at: 'removed_at3',
                            },
                        ],
                        total: 42,
                    }),
                ),
            },
            request: {
                query: {
                    page: 1,
                    perPage: 100,
                },
            },
        };

        it('should call ctx.publishedDataset.findRemovedPage', async () => {
            await getRemovedPage(ctx);

            expect(ctx.publishedDataset.findRemovedPage).toHaveBeenCalledWith(
                1,
                100,
            );
        });

        it('should return only the last version of each doc', async () => {
            await getRemovedPage(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toEqual({
                data: [
                    {
                        uri: 1,
                        v: 2,
                        reason: 'reason1',
                        removed_at: 'removed_at1',
                    },
                    {
                        uri: 2,
                        v: 3,
                        reason: 'reason2',
                        removed_at: 'removed_at2',
                    },
                    {
                        uri: 3,
                        v: 1,
                        reason: 'reason3',
                        removed_at: 'removed_at3',
                    },
                ],
                total: 42,
            });
        });
    });

    describe('editResource', () => {
        const ctx = {
            publishedDataset: {
                findByUri: jest.fn().mockImplementation(() =>
                    Promise.resolve({
                        uri: 'the uri',
                        versions: [
                            'version',
                            {
                                editedField: 'old value',
                            },
                        ],
                    }),
                ),
                addVersion: jest
                    .fn()
                    .mockImplementation(() =>
                        Promise.resolve('the new version'),
                    ),
            },
            updateFacetValue: jest.fn(),
            request: {
                body: {
                    resource: {
                        uri: 'the uri',
                        editedField: 'new value',
                    },
                    field: {
                        name: 'editedField',
                        isFacet: true,
                    },
                },
            },
        };

        it('should find the resource by its uri', async () => {
            await editResource(ctx);

            expect(ctx.publishedDataset.findByUri).toHaveBeenCalledWith(
                'the uri',
            );
        });

        it('should add the new version', async () => {
            await editResource(ctx);

            expect(ctx.publishedDataset.addVersion).toHaveBeenCalledWith(
                {
                    uri: 'the uri',
                    versions: [
                        'version',
                        {
                            editedField: 'old value',
                        },
                    ],
                },
                {
                    uri: 'the uri',
                    editedField: 'new value',
                },
            );
        });

        it('should updateFacetValue if field is a facet', async () => {
            await editResource(ctx);

            expect(ctx.updateFacetValue).toHaveBeenCalledWith({
                field: 'editedField',
                oldValue: 'old value',
                newValue: 'new value',
            });
        });

        it('should not updateFacetValue if field is not a facet', async () => {
            const noFacetCtx = {
                publishedDataset: {
                    findByUri: jest.fn().mockImplementation(() =>
                        Promise.resolve({
                            uri: 'the uri',
                            versions: [
                                'version',
                                {
                                    editedField: 'old value',
                                },
                            ],
                        }),
                    ),
                    addVersion: jest
                        .fn()
                        .mockImplementation(() =>
                            Promise.resolve('the new version'),
                        ),
                },
                updateFacetValue: jest.fn(),
                request: {
                    body: {
                        resource: {
                            uri: 'the uri',
                            editedField: 'new value',
                        },
                        field: {
                            name: 'editedField',
                            isFacet: false,
                        },
                    },
                },
            };
            await editResource(noFacetCtx);

            expect(noFacetCtx.updateFacetValue).not.toHaveBeenCalled();
        });

        it('should return the new version', async () => {
            await editResource(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toBe('the new version');
        });
    });

    describe('removeResource', () => {
        const date = new Date();
        const ctx = {
            publishedDataset: {
                hide: jest
                    .fn()
                    .mockImplementation(() => Promise.resolve('foo')),
            },
            request: {
                body: {
                    uri: 'the uri',
                    reason: 'the reason',
                    removedAt: date,
                },
            },
            hiddenResource: {
                create: jest.fn().mockImplementation(() => ({
                    _id: '65ba559de49f0fc00f4581ba',
                    uri: 'uid:/0R4JCK4F',
                    reason: 'Reason',
                    removedAt: date,
                })),
            },
        };

        it('should hide the resource', async () => {
            await removeResource(ctx);

            expect(ctx.publishedDataset.hide).toHaveBeenCalledWith(
                'the uri',
                'the reason',
                date,
            );

            expect(ctx.hiddenResource.create).toHaveBeenCalledWith({
                uri: 'the uri',
                reason: 'the reason',
                removedAt: date,
            });
        });

        it('should return the result', async () => {
            await removeResource(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toBe('foo');
        });
    });

    describe('restoreResource', () => {
        const ctx = {
            publishedDataset: {
                restore: jest
                    .fn()
                    .mockImplementation(() => Promise.resolve('foo')),
            },
            request: {
                body: {
                    uri: 'the uri',
                },
            },
            hiddenResource: {
                deleteByUri: jest.fn().mockImplementation(() => ({
                    acknowledged: true,
                    deletedCount: 1,
                })),
            },
        };

        it('should restore the resource', async () => {
            await restoreResource(ctx);

            expect(ctx.publishedDataset.restore).toHaveBeenCalledWith(
                'the uri',
            );

            expect(ctx.hiddenResource.deleteByUri).toHaveBeenCalledWith(
                'the uri',
            );
        });

        it('should return the result', async () => {
            await restoreResource(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toBe('foo');
        });
    });

    describe('createResource', () => {
        it('should call findByUri with body.uri and create with body', async () => {
            const ctx = {
                publishedDataset: {
                    findByUri: jest.fn().mockImplementation(() => null),
                    create: jest.fn().mockImplementation(() => 'create result'),
                },
                request: {
                    body: {
                        uri: 'the uri',
                        data: 'value',
                    },
                },
            };

            await createResource(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toEqual({ uri: 'the uri' });
            expect(ctx.publishedDataset.findByUri).toHaveBeenCalledWith(
                'the uri',
            );
            expect(ctx.publishedDataset.create).toHaveBeenCalledWith({
                uri: 'the uri',
                data: 'value',
            });
        });

        it('should call findByUri with body.uri and return 401 if it found something', async () => {
            const ctx = {
                publishedDataset: {
                    findByUri: jest
                        .fn()
                        .mockImplementation(() => 'found something'),
                    create: jest.fn().mockImplementation(() => 'create result'),
                },
                request: {
                    body: {
                        uri: 'the uri',
                        data: 'value',
                    },
                },
            };

            await createResource(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toBe('uri_conflict');
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.status).toBe(400);
            expect(ctx.publishedDataset.findByUri).toHaveBeenCalledWith(
                'the uri',
            );
            expect(ctx.publishedDataset.create).not.toHaveBeenCalled();
        });
    });

    describe('completeFilters', () => {
        const connectionStringURI = process.env.MONGO_URL;
        let db;
        let connection: any;
        let annotationModel: any;

        beforeAll(async () => {
            connection = await MongoClient.connect(connectionStringURI!);
            db = connection.db();
            annotationModel = await createAnnotationModel(db);
        });

        afterAll(async () => {
            await connection.close();
        });

        beforeEach(async () => {
            await annotationModel.deleteMany({});
        });

        it('should return an empty object if filters is null', async () => {
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            const result = await completeFilters(null);

            expect(result).toEqual({});
        });

        it('should add and empty resourceUris filter if annotated is true and not annotations exists', async () => {
            const result = await completeFilters(
                {
                    annotated: true,
                },
                { annotation: annotationModel },
            );

            expect(result).toEqual({
                resourceUris: [],
            });
        });

        it('should add and empty excludedResourceUris filter if annotated is false and not annotations exists', async () => {
            const result = await completeFilters(
                {
                    annotated: false,
                },
                { annotation: annotationModel },
            );

            expect(result).toEqual({
                excludedResourceUris: [],
            });
        });

        it('should and a resourceUris filter with all annotated resourceUris if annotated is true', async () => {
            await Promise.all(
                [
                    {
                        resourceUri: 'uri1',
                        fieldId: 'field1',
                    },
                    {
                        resourceUri: 'uri1',
                        fieldId: 'field2',
                    },
                    {
                        resourceUri: 'uri2',
                        fieldId: 'field1',
                    },
                    {
                        resourceUri: 'uri3',
                        fieldId: 'field1',
                    },
                ].map(annotationModel.create),
            );

            const result = await completeFilters(
                {
                    annotated: true,
                },
                { annotation: annotationModel },
            );

            expect(result).toEqual({
                resourceUris: ['uri1', 'uri2', 'uri3'],
            });
        });

        it('should set resourceUris to the intersection between annotatedResourceUris and resourceUris filter if present when annotated is true', async () => {
            await Promise.all(
                [
                    {
                        resourceUri: 'uri1',
                        fieldId: 'field1',
                    },
                    {
                        resourceUri: 'uri1',
                        fieldId: 'field2',
                    },
                    {
                        resourceUri: 'uri2',
                        fieldId: 'field1',
                    },
                    {
                        resourceUri: 'uri3',
                        fieldId: 'field1',
                    },
                ].map(annotationModel.create),
            );

            const result = await completeFilters(
                {
                    annotated: true,
                    resourceUris: ['uri1', 'uri3', 'uri7'],
                    excludedResourceUris: ['uri100', 'uri200'],
                },
                { annotation: annotationModel },
            );

            expect(result).toEqual({
                resourceUris: ['uri1', 'uri3'],
                excludedResourceUris: ['uri100', 'uri200'],
            });
        });

        it('should and a excludedResourceUris filter with all annotated resourceUris if annotated is false', async () => {
            await Promise.all(
                [
                    {
                        resourceUri: 'uri1',
                        fieldId: 'field1',
                    },
                    {
                        resourceUri: 'uri1',
                        fieldId: 'field2',
                    },
                    {
                        resourceUri: 'uri2',
                        fieldId: 'field1',
                    },
                    {
                        resourceUri: 'uri3',
                        fieldId: 'field1',
                    },
                ].map(annotationModel.create),
            );

            const result = await completeFilters(
                {
                    annotated: false,
                },
                { annotation: annotationModel },
            );

            expect(result).toEqual({
                excludedResourceUris: ['uri1', 'uri2', 'uri3'],
            });
        });

        it('should add annotatedResourceUris to excludedResourceUris filter if present when annotated is false', async () => {
            await Promise.all(
                [
                    {
                        resourceUri: 'uri1',
                        fieldId: 'field1',
                    },
                    {
                        resourceUri: 'uri1',
                        fieldId: 'field2',
                    },
                    {
                        resourceUri: 'uri2',
                        fieldId: 'field1',
                    },
                    {
                        resourceUri: 'uri3',
                        fieldId: 'field1',
                    },
                ].map(annotationModel.create),
            );

            const result = await completeFilters(
                {
                    annotated: false,
                    resourceUris: ['uri1', 'uri7'],
                    excludedResourceUris: ['uri100', 'uri200'],
                },
                { annotation: annotationModel },
            );

            expect(result).toEqual({
                resourceUris: ['uri1', 'uri7'],
                excludedResourceUris: [
                    'uri100',
                    'uri200',
                    'uri1',
                    'uri2',
                    'uri3',
                ],
            });
        });
    });
});
