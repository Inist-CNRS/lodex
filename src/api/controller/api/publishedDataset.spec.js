import { MongoClient } from 'mongodb';
import {
    getPage,
    getRemovedPage,
    editResource,
    removeResource,
    restoreResource,
    createResource,
    completeFilters,
} from './publishedDataset';
import createAnnotationModel from '../../models/annotation';
import createPublishedDatasetModel from '../../models/publishedDataset';

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
            let connection;
            let db;
            let annotationModel;
            let publishedDatasetModel;

            beforeAll(async () => {
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

            expect(ctx.body).toBe('uri_conflict');
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
        let connection;
        let annotationModel;

        beforeAll(async () => {
            connection = await MongoClient.connect(connectionStringURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
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

        it('should add annotatedResourceUris to resourceUris filter if present when annotated is true', async () => {
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
                    resourceUris: ['uri1', 'uri7'],
                    excludedResourceUris: ['uri100', 'uri200'],
                },
                { annotation: annotationModel },
            );

            expect(result).toEqual({
                resourceUris: ['uri1', 'uri7', 'uri2', 'uri3'],
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
