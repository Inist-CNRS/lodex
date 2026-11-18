import type { Queue } from 'bull';
import { getOrCreateWorkerQueue } from '../../workers';
import { resetTheme } from '../../services/modelRestore';
import { stopImport } from '../../workers/tools';
import {
    clearDataset,
    deleteManyDatasetRowByFilter,
    deleteManyDatasetRowByIds,
} from './dataset';

const tenant = 'lodex_test';
jest.mock('../../workers');
jest.mock('../../services/modelRestore', () => ({ resetTheme: jest.fn() }));
jest.mock('../../workers/tools', () => ({ stopImport: jest.fn() }));

describe('dataset API', () => {
    let workerQueue: Queue | null = null;
    beforeEach(() => {
        jest.mocked(getOrCreateWorkerQueue).mockImplementation(() => {
            workerQueue = {
                add: jest.fn(),
            } as unknown as Queue;
            return workerQueue;
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
    describe('DELETE /dataset', () => {
        const makeCtx = () => ({
            tenant,
            db: {
                listCollections: () => ({
                    toArray: async () => [
                        { name: 'dataset' },
                        { name: 'configTenant' },
                    ],
                }),
                dropCollection: jest.fn(),
            },
            body: undefined as unknown,
        });

        it('should reset the theme and drop every collection but configTenant', async () => {
            jest.mocked(resetTheme).mockResolvedValue(undefined);
            const ctx = makeCtx();

            await clearDataset(ctx);

            expect(resetTheme).toHaveBeenCalledWith(ctx);
            expect(ctx.db.dropCollection).toHaveBeenCalledTimes(1);
            expect(ctx.db.dropCollection).toHaveBeenCalledWith('dataset');
            expect(ctx.body).toEqual({ status: 'success' });
        });

        // the import would write the dataset again
        it('should stop the running import before dropping', async () => {
            const ctx = makeCtx();

            await clearDataset(ctx);

            expect(stopImport).toHaveBeenCalledWith(ctx);
            expect(
                jest.mocked(stopImport).mock.invocationCallOrder[0],
            ).toBeLessThan(ctx.db.dropCollection.mock.invocationCallOrder[0]);
        });

        it('should drop nothing when the theme reset fails', async () => {
            jest.mocked(resetTheme).mockRejectedValue(new Error('boom'));
            const ctx = makeCtx();

            await clearDataset(ctx);

            expect(ctx.db.dropCollection).not.toHaveBeenCalled();
            expect(ctx.body).toMatchObject({ status: 'error' });
        });
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
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.status).toBe(400);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toEqual({
                status: 'error',
                error: 'ids parameter is missing',
            });

            expect(ctx.dataset.deleteManyById).not.toHaveBeenCalled();
            expect(workerQueue?.add).not.toBeDefined();
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
            expect(workerQueue?.add).toHaveBeenCalledWith(
                'publisher',
                { jobType: 'publisher', tenant },
                { jobId: expect.any(String) },
            );
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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
            expect(workerQueue?.add).toHaveBeenCalledTimes(0);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.status).toBe(400);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toEqual({
                status: 'error',
                error: 'filter parameter is incomplete',
            });

            expect(ctx.dataset.deleteMany).not.toHaveBeenCalled();
            expect(workerQueue?.add).toHaveBeenCalledTimes(0);
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
            expect(workerQueue?.add).toHaveBeenCalledWith(
                'publisher',
                { jobType: 'publisher', tenant },
                { jobId: expect.any(String) },
            );
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
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
            expect(workerQueue?.add).toHaveBeenCalledTimes(0);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toEqual({ status: 'deleted' });
        });
    });
});
