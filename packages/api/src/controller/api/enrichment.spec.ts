import type Koa from 'koa';
import { workerQueues } from '../../workers';
import { cancelJob, getActiveJob } from '../../workers/tools';
import {
    deleteEnrichment,
    launchAllEnrichment,
    postEnrichment,
    putEnrichment,
    retryEnrichmentOnFailedRow,
} from './enrichment';

jest.mock('../../workers/tools', () => ({
    getActiveJob: jest.fn(),
    cancelJob: jest.fn(),
}));

jest.mock('../../workers', () => ({
    workerQueues: {
        test: { add: jest.fn(async () => ({ id: 'job-id' })) },
    },
}));

describe('Enrichment controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('postEnrichment', () => {
        it('should call enrichment create repository method', async () => {
            const ctx = {
                request: { body: { advancedMode: true, name: 'test' } },
                enrichment: { create: jest.fn() },
                configTenant: {},
            };

            await postEnrichment(ctx);

            expect(ctx.enrichment.create).toHaveBeenCalledWith({
                advancedMode: true,
                name: 'test',
            });
        });

        it('should return result as body result', async () => {
            const ctx = {
                request: { body: { advancedMode: true, name: 'test' } },
                enrichment: {
                    create: jest.fn(() => {
                        return { advancedMode: true, name: 'test' };
                    }),
                },
                configTenant: {},
            };

            await postEnrichment(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toStrictEqual({
                advancedMode: true,
                name: 'test',
            });
        });

        it("should set status 403 if there's not result", async () => {
            const ctx = {
                request: { body: 'my enrichment' },
                enrichment: {
                    create: jest.fn(() => null),
                },
                configTenant: {},
            };

            await postEnrichment(ctx);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.status).toBe(403);
        });
    });

    describe('putEnrichment', () => {
        it('should delete existing dataset data based on the enrichment name and update it', async () => {
            const ctx = {
                request: {
                    body: {
                        webServiceUrl: 'dummy.url',
                        dataSource: 'dataset',
                        sourceColumn: 'dummyColumn',
                    },
                } as Koa.Request,
                db: {
                    collection: jest
                        .fn()
                        .mockImplementation((collectionName) => ({
                            collectionName,
                            idField: '_id',
                            count: () => Promise.resolve(1),
                            find: () => ({
                                limit: () => ({
                                    toArray: () =>
                                        Promise.resolve([{ _id: 42 }]),
                                }),
                            }),
                        })),
                },
                enrichment: {
                    findOneById: jest.fn(() =>
                        Promise.resolve({ name: 'NAME' }),
                    ),
                    update: jest.fn(() =>
                        Promise.resolve('updated enrichment'),
                    ),
                },
                dataset: { removeAttribute: jest.fn() },
                configTenant: {},

                status: 200,
                body: null,
            } satisfies Partial<Koa.Context>;

            await putEnrichment(ctx, 42);

            expect(ctx.status).toBe(200);

            expect(ctx.enrichment.findOneById).toHaveBeenCalledWith(42);
            expect(ctx.dataset.removeAttribute).toHaveBeenCalledWith('NAME');
            expect(ctx.enrichment.update).toHaveBeenCalledWith(
                42,
                expect.objectContaining({
                    webServiceUrl: 'dummy.url',
                    sourceColumn: 'dummyColumn',
                }),
            );
            expect(ctx.body).toBe('updated enrichment');
            return;
        });

        it('should return a 403 on error if an error occured', async () => {
            const ctx = {
                request: { body: 'my updated enrichment' },
                enrichment: {
                    findOneById: async () => {
                        throw new Error('ERROR!');
                    },
                },
                configTenant: {},
            };

            await putEnrichment(ctx, 42);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.status).toBe(403);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toEqual({ error: 'ERROR!' });
        });
    });

    describe('deleteEnrichment', () => {
        it('should delete existing dataset data based on the enrichment name and then delete it', async () => {
            const ctx = {
                enrichment: {
                    findOneById: jest.fn(() => ({ name: 'NAME' })),
                    delete: jest.fn(),
                },
                dataset: { removeAttribute: jest.fn() },
                precomputed: {
                    removeResultColumn: jest.fn(),
                },
                configTenant: {},
            };
            // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
            getActiveJob.mockResolvedValue({
                data: { id: 42, jobType: 'enricher' },
            });

            await deleteEnrichment(ctx, 42);

            expect(ctx.enrichment.findOneById).toHaveBeenCalledWith(42);
            expect(ctx.dataset.removeAttribute).toHaveBeenCalledWith('NAME');
            expect(ctx.precomputed.removeResultColumn).toHaveBeenCalledTimes(0);
            expect(ctx.enrichment.delete).toHaveBeenCalledWith(42);
            expect(cancelJob).toHaveBeenCalled();
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.status).toBe(200);
        });
        it('should delete existing dataset data based on the enrichment name and then delete it when DataSource is "dataset"', async () => {
            const ctx = {
                enrichment: {
                    findOneById: jest.fn(() => ({
                        name: 'NAME',
                        dataSource: 'dataset',
                    })),
                    delete: jest.fn(),
                },
                dataset: { removeAttribute: jest.fn() },
                precomputed: {
                    removeResultColumn: jest.fn(),
                },
                configTenant: {},
            };
            // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
            getActiveJob.mockResolvedValue({
                data: { id: 42, jobType: 'enricher' },
            });

            await deleteEnrichment(ctx, 42);

            expect(ctx.enrichment.findOneById).toHaveBeenCalledWith(42);
            expect(ctx.dataset.removeAttribute).toHaveBeenCalledWith('NAME');
            expect(ctx.precomputed.removeResultColumn).toHaveBeenCalledTimes(0);
            expect(ctx.enrichment.delete).toHaveBeenCalledWith(42);
            expect(cancelJob).toHaveBeenCalled();
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.status).toBe(200);
        });
        it('should delete existing precomputed data based on the enrichment dataSource and name and then delete it', async () => {
            const ctx = {
                enrichment: {
                    findOneById: jest.fn(() => ({
                        name: 'NAME',
                        dataSource: 'precomputed-1',
                    })),
                    delete: jest.fn(),
                },
                dataset: { removeAttribute: jest.fn() },
                precomputed: {
                    removeResultColumn: jest.fn(),
                },
                configTenant: {},
            };
            // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
            getActiveJob.mockResolvedValue({
                data: { id: 42, jobType: 'enricher' },
            });

            await deleteEnrichment(ctx, 42);

            expect(ctx.enrichment.findOneById).toHaveBeenCalledWith(42);
            expect(ctx.dataset.removeAttribute).toHaveBeenCalledTimes(0);
            expect(ctx.precomputed.removeResultColumn).toHaveBeenCalledWith(
                'precomputed-1',
                'NAME',
            );
            expect(ctx.enrichment.delete).toHaveBeenCalledWith(42);
            expect(cancelJob).toHaveBeenCalled();
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.status).toBe(200);
        });

        it('should return a 404 if the enrichment does not exist', async () => {
            const ctx = {
                enrichment: {
                    findOneById: jest.fn(() => null),
                    delete: jest.fn(),
                },
                dataset: { removeAttribute: jest.fn() },
                configTenant: {},
            };

            await deleteEnrichment(ctx, 42);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.status).toBe(404);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toEqual({ error: 'Enrichment not found' });
        });

        it('should return a 403 on error if an error occured', async () => {
            const ctx = {
                enrichment: {
                    findOneById: async () => {
                        throw new Error('ERROR!');
                    },
                    delete: jest.fn(),
                },
                dataset: { removeAttribute: jest.fn() },
                configTenant: {},
            };

            await deleteEnrichment(ctx, 42);

            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.status).toBe(403);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.body).toEqual({ error: 'ERROR!' });
        });
    });

    describe('launchAllEnrichment', () => {
        it('should retrieve all enrichments and create a job for each of them setting their status to pending', async () => {
            jest.mock('../../workers', () => ({
                workerQueues: {
                    test: { add: jest.fn(async () => ({ id: 'job-id' })) },
                },
            }));
            const ctx = {
                enrichment: {
                    findAll: jest.fn(() => [
                        {
                            _id: 1,
                            status: 'PENDING',
                        },
                        {
                            _id: 2,
                            status: 'PENDING',
                        },
                    ]),
                    updateStatus: jest.fn(async () => {}),
                },
                dataset: {
                    getColumns: jest.fn().mockResolvedValue([]),
                    removeAttribute: jest.fn(async () => {}),
                },
                tenant: 'test',
            };

            await launchAllEnrichment(ctx);

            expect(ctx.enrichment.findAll).toHaveBeenCalled();
            expect(ctx.dataset.removeAttribute).not.toHaveBeenCalled();
            expect(ctx.enrichment.updateStatus).toHaveBeenCalledTimes(2);
            expect(ctx.enrichment.updateStatus).toHaveBeenCalledWith(
                1,
                'PENDING',
                { jobId: 'job-id' },
            );
            expect(ctx.enrichment.updateStatus).toHaveBeenCalledWith(
                2,
                'PENDING',
                { jobId: 'job-id' },
            );
        });
        it('should remove enrichmentAttribute from dataset when its status is FINISHED', async () => {
            jest.mock('../../workers', () => ({
                workerQueues: {
                    test: { add: jest.fn(async () => ({ id: 'job-id' })) },
                },
            }));

            const ctx = {
                enrichment: {
                    findAll: jest.fn(() => [
                        {
                            _id: 1,
                            name: 'pending-attribute',
                            status: 'PENDING',
                        },
                        {
                            _id: 2,
                            name: 'finished-attribute',
                            status: 'FINISHED',
                        },
                    ]),
                    updateStatus: jest.fn(async () => {}),
                },
                dataset: {
                    getColumns: jest.fn().mockResolvedValue([]),
                    removeAttribute: jest.fn(async () => {}),
                },
                tenant: 'test',
            };

            await launchAllEnrichment(ctx);

            expect(ctx.enrichment.findAll).toHaveBeenCalled();
            expect(ctx.dataset.removeAttribute).toHaveBeenCalledTimes(1);
            expect(ctx.dataset.removeAttribute).toHaveBeenCalledWith(
                'finished-attribute',
            );
            expect(ctx.enrichment.updateStatus).toHaveBeenCalledWith(
                1,
                'PENDING',
                { jobId: 'job-id' },
            );
            expect(ctx.enrichment.updateStatus).toHaveBeenCalledWith(
                2,
                'PENDING',
                { jobId: 'job-id' },
            );
        });
    });

    describe('retryEnrichmentOnFailedRow', () => {
        it('should retrieve given enrichments and create a job to retry failed dataset rows', async () => {
            jest.mock('../../workers', () => ({
                workerQueues: {
                    test: { add: jest.fn(async () => ({ id: 'job-id' })) },
                },
            }));
            const ctx = {
                enrichment: {
                    updateStatus: jest.fn(async () => {}),
                },
                dataset: {
                    getColumns: jest.fn().mockResolvedValue([]),
                    removeAttribute: jest.fn(async () => {}),
                },
                tenant: 'test',
            };

            await retryEnrichmentOnFailedRow(ctx, 1);

            expect(ctx.dataset.removeAttribute).not.toHaveBeenCalled();
            expect(ctx.enrichment.updateStatus).toHaveBeenCalledTimes(1);
            expect(ctx.enrichment.updateStatus).toHaveBeenCalledWith(
                1,
                'PENDING',
                { jobId: 'job-id' },
            );
            expect(workerQueues.test.add).toHaveBeenCalledTimes(1);
            expect(workerQueues.test.add).toHaveBeenCalledWith(
                'retry-enricher',
                { id: 1, jobType: 'retry-enricher', tenant: 'test' },
                { jobId: expect.any(String) },
            );
        });
    });
});
