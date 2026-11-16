import { TaskStatus } from '@lodex/common';
import { getOrCreateWorkerQueue } from '../workers';
import { ENRICHER, RETRY_ENRICHER } from '../workers/enricher';
import { PRECOMPUTER } from '../workers/precomputer';
import {
    queueEnrichment,
    queueEnrichmentJob,
    queuePrecomputed,
    type LaunchContext,
} from './launchTasks';

jest.mock('../workers');

describe('launchTasks', () => {
    const calls: string[] = [];
    let add: jest.Mock;
    let ctx: LaunchContext;

    beforeEach(() => {
        calls.length = 0;
        add = jest.fn().mockImplementation(async () => {
            calls.push('add');
            return { id: 'job-id' };
        });
        jest.mocked(getOrCreateWorkerQueue).mockReturnValue({
            add,
        } as unknown as ReturnType<typeof getOrCreateWorkerQueue>);
        ctx = {
            tenant: 'lodex_test',
            enrichment: {
                findOneById: jest
                    .fn()
                    .mockResolvedValue({ name: 'enr', dataSource: 'ds' }),
                updateStatus: jest.fn().mockImplementation(async () => {
                    calls.push('enrichment.updateStatus');
                }),
            },
            precomputed: {
                findOneById: jest.fn().mockResolvedValue({ name: 'pre' }),
                updateStatus: jest.fn().mockImplementation(async () => {
                    calls.push('precomputed.updateStatus');
                }),
            },
            dataset: {
                removeAttribute: jest.fn().mockImplementation(async () => {
                    calls.push('dataset.removeAttribute');
                }),
            },
            dataSource: {
                removeAttribute: jest.fn().mockImplementation(async () => {
                    calls.push('dataSource.removeAttribute');
                }),
            },
        } as unknown as LaunchContext;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('queueEnrichment', () => {
        it('writes PENDING with a jobId before adding the job', async () => {
            await queueEnrichment(ctx, 'e1');

            expect(calls).toEqual(['enrichment.updateStatus', 'add']);
            const [, status, data] = jest.mocked(ctx.enrichment.updateStatus)
                .mock.calls[0];
            expect(status).toBe(TaskStatus.PENDING);
            expect(add).toHaveBeenCalledWith(
                ENRICHER,
                { id: 'e1', jobType: ENRICHER, tenant: 'lodex_test' },
                { jobId: data?.jobId },
            );
            // an undefined lifo would override the queue's default (lifo)
            expect(add.mock.calls[0][2]).not.toHaveProperty('lifo');
            expect(data?.jobId).toEqual(expect.any(String));
        });

        it('uses the given jobId', async () => {
            await queueEnrichment(ctx, 'e1', { jobId: 'given-job-id' });

            expect(ctx.enrichment.updateStatus).toHaveBeenCalledWith(
                'e1',
                TaskStatus.PENDING,
                { jobId: 'given-job-id' },
            );
            expect(add.mock.calls[0][2]).toStrictEqual({
                jobId: 'given-job-id',
            });
            expect(calls).toEqual(['enrichment.updateStatus', 'add']);
        });

        it('forwards lifo', async () => {
            await queueEnrichment(ctx, 'e1', { lifo: false });

            expect(add.mock.calls[0][2]).toEqual(
                expect.objectContaining({ lifo: false }),
            );
        });

        it('removes the existing data first when relaunching', async () => {
            await queueEnrichment(ctx, 'e1', { relaunch: true });

            expect(ctx.dataSource.removeAttribute).toHaveBeenCalledWith(
                'ds',
                'enr',
            );
            expect(calls).toEqual([
                'dataSource.removeAttribute',
                'enrichment.updateStatus',
                'add',
            ]);
        });

        it('does not remove data when not relaunching', async () => {
            await queueEnrichment(ctx, 'e1');

            expect(ctx.dataSource.removeAttribute).not.toHaveBeenCalled();
        });
    });

    describe('queueEnrichmentJob', () => {
        it('queues the given job type', async () => {
            await queueEnrichmentJob(ctx, 'e1', RETRY_ENRICHER);

            expect(add.mock.calls[0][0]).toBe(RETRY_ENRICHER);
            expect(add.mock.calls[0][1]).toEqual({
                id: 'e1',
                jobType: RETRY_ENRICHER,
                tenant: 'lodex_test',
            });
        });
    });

    describe('queuePrecomputed', () => {
        it('writes PENDING with a jobId before adding the job', async () => {
            await queuePrecomputed(ctx, 'p1');

            expect(calls).toEqual(['precomputed.updateStatus', 'add']);
            const [id, status, data] = jest.mocked(ctx.precomputed.updateStatus)
                .mock.calls[0];
            expect(id).toBe('p1');
            expect(status).toBe(TaskStatus.PENDING);
            expect(data).toEqual({ hasData: false, jobId: expect.any(String) });
            expect(add).toHaveBeenCalledWith(
                PRECOMPUTER,
                {
                    id: 'p1',
                    jobType: PRECOMPUTER,
                    action: 'askForPrecomputed',
                    tenant: 'lodex_test',
                    subLabel: 'pre',
                },
                { jobId: data?.jobId },
            );
        });

        it('uses the given jobId', async () => {
            await queuePrecomputed(ctx, 'p1', { jobId: 'given-job-id' });

            expect(ctx.precomputed.updateStatus).toHaveBeenCalledWith(
                'p1',
                TaskStatus.PENDING,
                { hasData: false, jobId: 'given-job-id' },
            );
            expect(add.mock.calls[0][2]).toEqual({ jobId: 'given-job-id' });
            expect(calls).toEqual(['precomputed.updateStatus', 'add']);
        });

        it('removes the existing data first when relaunching', async () => {
            await queuePrecomputed(ctx, 'p1', { relaunch: true });

            expect(ctx.dataset.removeAttribute).toHaveBeenCalledWith('pre');
            expect(calls).toEqual([
                'dataset.removeAttribute',
                'precomputed.updateStatus',
                'add',
            ]);
        });

        it('does not remove data when not relaunching', async () => {
            await queuePrecomputed(ctx, 'p1');

            expect(ctx.dataset.removeAttribute).not.toHaveBeenCalled();
        });
    });
});
