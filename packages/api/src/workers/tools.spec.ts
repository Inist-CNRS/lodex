import { ProgressStatus } from '@lodex/common';
import progress from '../services/progress';
import { disableFusible } from '@ezs/core/fusible';
import { cancelJob } from './tools';

const mockActiveJobs: unknown[] = [];

jest.mock('./index', () => ({
    getOrCreateWorkerQueue: () => ({
        getActive: async () => mockActiveJobs,
        getCompleted: async () => [],
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

    it('does not stop the stream of another type of job', async () => {
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
