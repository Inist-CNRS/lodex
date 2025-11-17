import {
    listDataSource,
    previewDataSource,
    type ListDataSourceContext,
    type PreviewDataSourceContext,
} from './dataSource';

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
        const ctx = {
            body: '',
            dataset: {
                getExcerpt: jest.fn().mockResolvedValue([
                    { uri: 'uri://ABC', name: 'Item 1' },
                    { uri: 'uri://DEF', name: 'Item 2' },
                ]),
            },
            precomputed: {
                getSample: jest.fn().mockResolvedValue([
                    { id: 1, value: { name: 'A' } },
                    { id: 2, value: { name: 'B' } },
                ]),
            },
        } satisfies PreviewDataSourceContext;

        it('should preview the dataset data source', async () => {
            await previewDataSource(ctx, 'dataset');

            expect(ctx.body).toStrictEqual([
                { uri: 'uri://ABC', name: 'Item 1' },
                { uri: 'uri://DEF', name: 'Item 2' },
            ]);
        });

        it('should preview a precomputed data source', async () => {
            await previewDataSource(ctx, 'precomputed-id');

            expect(ctx.body).toStrictEqual([
                { id: 1, value: { name: 'A' } },
                { id: 2, value: { name: 'B' } },
            ]);
        });
    });
});
