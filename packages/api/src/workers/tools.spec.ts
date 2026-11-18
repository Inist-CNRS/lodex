import { ProgressStatus } from '@lodex/common';
import progress from '../services/progress';
import { disableFusible } from '@ezs/core/fusible';
import { cancelJob, clearJobs } from './tools';

const mockActiveJobs: unknown[] = [];

jest.mock('./index', () => ({
    getOrCreateWorkerQueue: () => ({
        getActive: async () => mockActiveJobs,
        getCompleted: async () => [],
        getWaiting: async () => [],
    }),
    cleanWaitingJobsOfType: jest.fn(),
    CancelWorkerError: class extends Error {},
}));
jest.mock('@ezs/core/fusible', () => ({ disableFusible: jest.fn() }));
jest.mock('./enricher', () => ({ handleEnrichmentError: jest.fn() }));
jest.mock('./import', () => ({ notifyListeners: jest.fn() }));

describe('cancelJob', () => {
    const ctx = { tenant: 'tools-spec' } as any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockActiveJobs.length = 0;
        progress.finish(ctx.tenant);
    });

    it('leaves the progress alone without an active import job', async () => {
        progress.start(ctx.tenant, {
            status: ProgressStatus.STARTING,
            target: 100,
            type: 'precomputer',
        });

        await cancelJob(ctx, 'import');

        expect(progress.getProgress(ctx.tenant).status).toBe(
            ProgressStatus.STARTING,
        );
    });

    it('stops a retry enrichment cancelled as an enrichment', async () => {
        mockActiveJobs.push({
            data: { jobType: 'retry-enricher', fusible: 'fusible' },
            moveToFailed: jest.fn(),
        });

        await cancelJob(ctx, 'enricher');

        expect(disableFusible).toHaveBeenCalledWith('fusible');
    });

    it('does not stop the stream of another job when cancelling an import', async () => {
        const moveToFailed = jest.fn();
        mockActiveJobs.push({
            data: { jobType: 'enricher', fusible: 'fusible' },
            moveToFailed,
        });

        await cancelJob(ctx, 'import');

        expect(disableFusible).not.toHaveBeenCalled();
        expect(moveToFailed).not.toHaveBeenCalled();
    });

    it('cancels the active import job', async () => {
        const moveToFailed = jest.fn();
        mockActiveJobs.push({ data: { jobType: 'import' }, moveToFailed });

        await cancelJob(ctx, 'import');

        expect(moveToFailed).toHaveBeenCalled();
    });
});

describe('clearJobs', () => {
    const ctx = {
        tenant: 'tools-spec',
        precomputed: { cancelByIds: jest.fn() },
        enrichment: { cancelByIds: jest.fn() },
    } as any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockActiveJobs.length = 0;
    });

    it('stops the stream of the active enrichment, as cancelJob does', async () => {
        const moveToFailed = jest.fn();
        mockActiveJobs.push({
            name: 'enricher',
            data: { jobType: 'enricher', id: 'e1', fusible: 'fusible' },
            moveToFailed,
        });

        await clearJobs(ctx);

        expect(disableFusible).toHaveBeenCalledWith('fusible');
        expect(moveToFailed).toHaveBeenCalled();
    });
});
