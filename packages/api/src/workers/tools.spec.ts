import { ProgressStatus } from '@lodex/common';
import progress from '../services/progress';
import { disableFusible } from '@ezs/core/fusible';
import { cancelJob, clearJobs, stopJobs } from './tools';
import { waitForRunningJob } from './index';
import { cancelImportJob } from './import';

const mockActiveJobs: unknown[] = [];

jest.mock('./index', () => ({
    getOrCreateWorkerQueue: () => ({
        getActive: async () => mockActiveJobs,
        getCompleted: async () => [],
        getWaiting: async () => [],
    }),
    cleanWaitingJobsOfType: jest.fn(),
    waitForRunningJob: jest.fn(),
    CancelWorkerError: class extends Error {},
}));
jest.mock('@ezs/core/fusible', () => ({ disableFusible: jest.fn() }));
jest.mock('./enricher', () => ({ handleEnrichmentError: jest.fn() }));
jest.mock('./import', () => ({
    IMPORT: 'import',
    notifyListeners: jest.fn(),
    cancelImportJob: jest.fn(),
}));

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

describe('stopJobs', () => {
    const ctx = {
        tenant: 'tools-spec',
        precomputed: { cancelByIds: jest.fn() },
        enrichment: { cancelByIds: jest.fn() },
    } as any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockActiveJobs.length = 0;
        jest.mocked(waitForRunningJob).mockResolvedValue(true);
    });

    it('cancels the running job and waits for it to stop writing', async () => {
        const moveToFailed = jest.fn();
        mockActiveJobs.push({
            name: 'publisher',
            data: { jobType: 'publisher', fusible: 'fusible' },
            moveToFailed,
        });

        await stopJobs(ctx);

        expect(disableFusible).toHaveBeenCalledWith('fusible');
        expect(moveToFailed).toHaveBeenCalled();
        expect(waitForRunningJob).toHaveBeenCalledWith(ctx.tenant, 30_000);
    });

    // its job does not store its fusible before the import starts
    it('stops an import through its job id', async () => {
        mockActiveJobs.push({
            id: 12,
            data: { jobType: 'import' },
            moveToFailed: jest.fn(),
        });

        await stopJobs(ctx);

        expect(cancelImportJob).toHaveBeenCalledWith(12);
    });

    it('leaves the import cancel to another job', async () => {
        mockActiveJobs.push({
            data: { jobType: 'enricher' },
            moveToFailed: jest.fn(),
        });

        await stopJobs(ctx);

        expect(cancelImportJob).not.toHaveBeenCalled();
    });

    it('fails once the running job does not stop in time', async () => {
        jest.mocked(waitForRunningJob).mockResolvedValue(false);

        await expect(stopJobs(ctx, 10)).rejects.toThrow('jobs_still_running');
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
