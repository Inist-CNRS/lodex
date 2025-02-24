import {
    deleteManyDatasetRowByFilter,
    deleteManyDatasetRowByIds,
} from './dataset';
import { workerQueues } from '../../workers';

const tenant = 'lodex_test';
jest.mock('../../workers', () => ({
    workerQueues: {
        lodex_test: {
            add: jest.fn(),
        },
    },
}));

describe('dataset API', () => {
    beforeEach(() => {
        workerQueues[tenant].add.mockClear();
    });
    describe('DELETE /dataset/batch-delete-id', () => {
        it('should return 400 if ids query parameter is absent', async () => {
            const ctx = {
                request: { query: {} },
                tenant,
                dataset: {
                    deleteManyById: jest.fn().mockResolvedValue({
                        acknowledged: true,
                        deletedCount: 3,
                    }),
                },
                publishedDataset: {
                    countAll: jest.fn().mockResolvedValue(1),
                },
            };
            await deleteManyDatasetRowByIds(ctx);
            expect(ctx.status).toBe(400);
            expect(ctx.body).toEqual({
                status: 'error',
                error: 'ids parameter is missing',
            });

            expect(ctx.dataset.deleteManyById).not.toHaveBeenCalled();
            expect(workerQueues[tenant].add).toHaveBeenCalledTimes(0);
        });

        it('should delete the rows matching the ids and republish when publishedDataset is not empty', async () => {
            const ctx = {
                request: { query: { ids: '1,2,3' } },
                tenant,
                dataset: {
                    deleteManyById: jest.fn().mockResolvedValue({
                        acknowledged: true,
                        deletedCount: 3,
                    }),
                },
                publishedDataset: {
                    countAll: jest.fn().mockResolvedValue(1),
                },
            };

            await deleteManyDatasetRowByIds(ctx);
            expect(ctx.dataset.deleteManyById).toHaveBeenCalledWith([
                '1',
                '2',
                '3',
            ]);
            expect(ctx.publishedDataset.countAll).toHaveBeenCalled();
            expect(workerQueues[tenant].add).toHaveBeenCalledWith(
                'publisher',
                { jobType: 'publisher', tenant },
                { jobId: expect.any(String) },
            );
            expect(ctx.body).toEqual({ status: 'deleted' });
        });

        it('should delete the rows matching the ids and not republish when publishedDataset is empty', async () => {
            const ctx = {
                request: { query: { ids: '1,2,3' } },
                tenant,
                dataset: {
                    deleteManyById: jest.fn().mockResolvedValue({
                        acknowledged: true,
                        deletedCount: 3,
                    }),
                },
                publishedDataset: {
                    countAll: jest.fn().mockResolvedValue(0),
                },
            };

            await deleteManyDatasetRowByIds(ctx);
            expect(ctx.dataset.deleteManyById).toHaveBeenCalledWith([
                '1',
                '2',
                '3',
            ]);
            expect(ctx.publishedDataset.countAll).toHaveBeenCalled();
            expect(workerQueues[tenant].add).toHaveBeenCalledTimes(0);
            expect(ctx.body).toEqual({ status: 'deleted' });
        });
    });

    describe('DELETE /dataset/batch-delete-filter', () => {
        it('should return 400 if filter query parameter is absent', async () => {
            const ctx = {
                request: { query: {} },
                tenant,
                dataset: {
                    deleteMany: jest.fn().mockResolvedValue({
                        acknowledged: true,
                        deletedCount: 3,
                    }),
                },
            };
            await deleteManyDatasetRowByFilter(ctx);
            expect(ctx.status).toBe(400);
            expect(ctx.body).toEqual({
                status: 'error',
                error: 'filter parameter is incomplete',
            });

            expect(ctx.dataset.deleteMany).not.toHaveBeenCalled();
            expect(workerQueues[tenant].add).toHaveBeenCalledTimes(0);
        });

        it('should delete the rows matching the filter and republish when publishedDataset is not empty', async () => {
            const ctx = {
                request: {
                    query: {
                        filterBy: 'foo',
                        filterOperator: 'eq',
                        filterValue: 'bar',
                    },
                },
                tenant,
                dataset: {
                    deleteMany: jest.fn().mockResolvedValue({
                        acknowledged: true,
                        deletedCount: 3,
                    }),
                },
                publishedDataset: {
                    countAll: jest.fn().mockResolvedValue(1),
                },
            };

            await deleteManyDatasetRowByFilter(ctx);
            expect(ctx.dataset.deleteMany).toHaveBeenCalledWith({
                foo: /^.*[bƀƃƅƄɃ][aàáâãäåāăąǎǟǡǻȁȃȧȺ][rŕŗřȑȓɍ].*$/gi,
            });
            expect(ctx.publishedDataset.countAll).toHaveBeenCalled();
            expect(workerQueues[tenant].add).toHaveBeenCalledWith(
                'publisher',
                { jobType: 'publisher', tenant },
                { jobId: expect.any(String) },
            );
            expect(ctx.body).toEqual({ status: 'deleted' });
        });

        it('should delete the rows matching the filter and not republish when publishedDataset is empty', async () => {
            const ctx = {
                request: {
                    query: {
                        filterBy: 'foo',
                        filterOperator: 'eq',
                        filterValue: 'bar',
                    },
                },
                tenant,
                dataset: {
                    deleteMany: jest.fn().mockResolvedValue({
                        acknowledged: true,
                        deletedCount: 3,
                    }),
                },
                publishedDataset: {
                    countAll: jest.fn().mockResolvedValue(0),
                },
            };

            await deleteManyDatasetRowByFilter(ctx);
            expect(ctx.dataset.deleteMany).toHaveBeenCalledWith({
                foo: /^.*[bƀƃƅƄɃ][aàáâãäåāăąǎǟǡǻȁȃȧȺ][rŕŗřȑȓɍ].*$/gi,
            });
            expect(ctx.publishedDataset.countAll).toHaveBeenCalled();
            expect(workerQueues[tenant].add).toHaveBeenCalledTimes(0);
            expect(ctx.body).toEqual({ status: 'deleted' });
        });
    });
});
