import { getEnrichmentDataPreview } from '../../services/enrichment/enrichment';
import {
    listDataSource,
    previewDataSource,
    type ListDataSourceContext,
    type PreviewDataSourceContext,
} from './dataSource';

jest.mock('../../services/enrichment/enrichment', () => ({
    getEnrichmentDataPreview: jest.fn(),
}));

describe('dataSource', () => {
    describe('listDataSource', () => {
        const ctx = {
            body: '',
            dataset: {
                getColumnsWithSubPaths: jest.fn().mockResolvedValue([
                    { name: 'uri', subPaths: [] },
                    { name: 'title', subPaths: [] },
                ]),
            },
            precomputed: {
                findAll: jest.fn().mockResolvedValue([
                    {
                        _id: 'precomputed-id-1',
                        name: 'Precomputed 1',
                        status: 'FINISHED',
                    },
                    {
                        _id: 'precomputed-id-2',
                        name: 'Precomputed 2',
                        status: 'RUNNING',
                    },
                ]),
                getColumnsWithSubPaths: jest
                    .fn()
                    .mockImplementation((id: string) => {
                        if (id === 'precomputed-id-1') {
                            return Promise.resolve([
                                { name: 'id', subPaths: [] },
                                { name: 'value', subPaths: ['name'] },
                            ]);
                        }
                        return Promise.resolve([]);
                    }),
            },
        } satisfies ListDataSourceContext;

        it('should list data sources with their columns', async () => {
            await listDataSource(ctx);

            expect(ctx.body).toStrictEqual([
                {
                    id: 'dataset',
                    name: 'dataset',
                    columns: [
                        {
                            name: 'uri',
                            subPaths: [],
                        },
                        {
                            name: 'title',
                            subPaths: [],
                        },
                    ],
                    status: 'FINISHED',
                    isEmpty: false,
                },
                {
                    id: 'precomputed-id-1',
                    name: 'Precomputed 1',
                    status: 'FINISHED',
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
                {
                    id: 'precomputed-id-2',
                    name: 'Precomputed 2',
                    status: 'RUNNING',
                    columns: [],
                    isEmpty: true,
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
