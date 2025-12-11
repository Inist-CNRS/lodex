import { TaskStatus } from '@lodex/common';
import { Collection, type Db, MongoClient, ObjectId } from 'mongodb';
import dataset from '../../models/dataset';
import type {
    DatasetService,
    DataSourceService,
    PrecomputedService,
} from '../../models/dataSource';
import createDataSourceService from '../../models/dataSource';
import precomputed from '../../models/precomputed';
import { getEnrichmentDataPreview } from '../../services/enrichment/enrichment';
import {
    listDataSource,
    previewDataSource,
    type PreviewDataSourceContext,
} from './dataSource';

jest.mock('../../services/enrichment/enrichment', () => ({
    getEnrichmentDataPreview: jest.fn(),
}));

const PRECOMPUTED_ID = '64b64c4f2f4d88b6f0e4d1a1';
describe('dataSource', () => {
    let connection: MongoClient;
    let db: Db;

    let datasetService: DatasetService;
    let precomputedService: PrecomputedService;
    let dataSource: DataSourceService;

    let datasetCollection: Collection;
    let precomputedCollection: Collection;
    let precomputedDataCollection: Collection;

    beforeAll(async () => {
        connection = await MongoClient.connect(process.env.MONGO_URL!);
        db = connection.db();

        datasetService = await dataset(db);
        precomputedService = await precomputed(db);
        dataSource = createDataSourceService(
            datasetService,
            precomputedService,
        );

        datasetCollection = db.collection('dataset');
        precomputedCollection = db.collection('precomputed');
        precomputedDataCollection = db.collection(`pc_${PRECOMPUTED_ID}`);
    });

    afterAll(async () => {
        await db.dropDatabase();
        await connection.close();
    });

    describe('listDataSource', () => {
        beforeEach(async () => {
            await Promise.all([
                datasetCollection.deleteMany({}),
                precomputedCollection.deleteMany({}),
                precomputedDataCollection.deleteMany({}),
            ]);

            await Promise.all([
                datasetCollection.insertMany([
                    {
                        uri: 'doi://ABC',
                        title: 'Item 1',
                        nested: { info: 'Info 1' },
                    },
                    {
                        uri: 'doi://DEF',
                        title: 'Item 2',
                        nested: { info: 'Info 2' },
                    },
                ]),
                precomputedCollection.insertMany([
                    {
                        _id: new ObjectId(PRECOMPUTED_ID),
                        name: 'Precomputed 1',
                        status: TaskStatus.FINISHED,
                    },
                ]),
                precomputedDataCollection.insertMany([
                    { id: 'abc', value: { name: 'A' } },
                    { id: 'def', value: { name: 'B' } },
                ]),
            ]);
        });

        it('should list data sources with their columns', async () => {
            const ctx = {
                body: '',
                dataSource,
            };

            await listDataSource(ctx);

            expect(ctx.body).toStrictEqual([
                {
                    id: 'dataset',
                    name: 'dataset',
                    columns: [
                        {
                            name: 'nested',
                            subPaths: ['info'],
                        },
                        {
                            name: 'title',
                            subPaths: [],
                        },
                        {
                            name: 'uri',
                            subPaths: [],
                        },
                    ],
                    status: TaskStatus.FINISHED,
                    isEmpty: false,
                },
                {
                    id: PRECOMPUTED_ID,
                    name: 'Precomputed 1',
                    status: TaskStatus.FINISHED,
                    columns: [
                        {
                            name: 'id',
                            subPaths: [],
                        },
                        {
                            name: 'value',
                            subPaths: ['name'],
                        },
                    ],
                    isEmpty: false,
                },
            ]);
        });
    });

    describe('previewDataSource', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it.each([
            {
                description: 'dataset data source',
                requestBody: { dataSource: 'dataset' },
                datasetExcerpt: [
                    { uri: 'uri://ABC', name: 'Item 1' },
                    { uri: 'uri://DEF', name: 'Item 2' },
                ],
                precomputedSample: undefined,
                expectedBody: [
                    { uri: 'uri://ABC', name: 'Item 1' },
                    { uri: 'uri://DEF', name: 'Item 2' },
                ],
                expectedDatasetCall: true,
                expectedPrecomputedCall: false,
            },
            {
                description: 'precomputed data source',
                requestBody: { dataSource: 'precomputed-id' },
                datasetExcerpt: undefined,
                precomputedSample: [
                    { id: 1, value: { name: 'A' } },
                    { id: 2, value: { name: 'B' } },
                ],
                expectedBody: [
                    { id: 1, value: { name: 'A' } },
                    { id: 2, value: { name: 'B' } },
                ],
                expectedDatasetCall: false,
                expectedPrecomputedCall: true,
            },
        ])(
            'should preview $description',
            async ({
                requestBody,
                datasetExcerpt,
                precomputedSample,
                expectedBody,
                expectedDatasetCall,
                expectedPrecomputedCall,
            }) => {
                const ctx = {
                    body: '',
                    status: 200,
                    request: { body: requestBody },
                    dataset: {
                        getExcerpt: jest.fn().mockResolvedValue(datasetExcerpt),
                    },
                    precomputed: {
                        getSample: jest
                            .fn()
                            .mockResolvedValue(precomputedSample),
                    },
                } as unknown as PreviewDataSourceContext;

                await previewDataSource(ctx);

                if (expectedDatasetCall) {
                    expect(ctx.dataset.getExcerpt).toHaveBeenCalled();
                } else {
                    expect(ctx.dataset.getExcerpt).not.toHaveBeenCalled();
                }

                if (expectedPrecomputedCall) {
                    expect(ctx.precomputed.getSample).toHaveBeenCalledWith(
                        requestBody.dataSource,
                    );
                } else {
                    expect(ctx.precomputed.getSample).not.toHaveBeenCalled();
                }

                expect(ctx.body).toStrictEqual(expectedBody);
            },
        );

        it.each([
            {
                description: 'rule is provided',
                requestBody: {
                    dataSource: 'dataset',
                    rule: '[use]\nplugin = basics/uniq\nid = value',
                },
                mockPreviewData: [
                    'enriched value 1',
                    'enriched value 2',
                    'enriched value 3',
                ],
            },
            {
                description: 'sourceColumn is provided',
                requestBody: {
                    dataSource: 'precomputed-id',
                    sourceColumn: 'identifier',
                    subPath: 'value.name',
                },
                mockPreviewData: ['processed value 1', 'processed value 2'],
            },
        ])(
            'should call getEnrichmentDataPreview when $description',
            async ({ requestBody, mockPreviewData }) => {
                (getEnrichmentDataPreview as jest.Mock).mockResolvedValue(
                    mockPreviewData,
                );

                const ctx = {
                    body: '',
                    status: 200,
                    request: { body: requestBody },
                    dataset: { getExcerpt: jest.fn() },
                    precomputed: { getSample: jest.fn() },
                } as unknown as PreviewDataSourceContext;

                await previewDataSource(ctx);

                expect(getEnrichmentDataPreview).toHaveBeenCalledWith(ctx);
                expect(ctx.body).toStrictEqual(mockPreviewData);
                expect(ctx.dataset.getExcerpt).not.toHaveBeenCalled();
                expect(ctx.precomputed.getSample).not.toHaveBeenCalled();
            },
        );

        it('should return 400 when request body is invalid', async () => {
            const ctx = {
                body: '',
                status: 200,
                request: {
                    body: {
                        // missing dataSource
                    },
                },
                dataset: {
                    getExcerpt: jest.fn(),
                },
                precomputed: {
                    getSample: jest.fn(),
                },
            } as unknown as PreviewDataSourceContext;

            await previewDataSource(ctx);

            expect(ctx.status).toBe(400);
            expect(ctx.body).toStrictEqual({ error: 'invalid_request' });
        });

        it('should return 500 when getEnrichmentDataPreview throws an error', async () => {
            (getEnrichmentDataPreview as jest.Mock).mockRejectedValue(
                new Error('Enrichment processing failed'),
            );

            const ctx = {
                body: '',
                status: 200,
                request: {
                    body: {
                        dataSource: 'dataset',
                        rule: '[use]\nplugin = invalid',
                    },
                },
                dataset: {
                    getExcerpt: jest.fn(),
                },
                precomputed: {
                    getSample: jest.fn(),
                },
            } as unknown as PreviewDataSourceContext;

            await previewDataSource(ctx);

            expect(ctx.status).toBe(500);
            expect(ctx.body).toStrictEqual({ error: 'internal_error' });
        });
    });
});
