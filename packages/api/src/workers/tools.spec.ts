import { ProgressStatus } from '@lodex/common';
import progress from '../services/progress';
import { disableFusible } from '@ezs/core/fusible';
import { cancelJob, clearJobs, stopImport } from './tools';
import { cleanWaitingJobsOfType } from './index';

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
const mockImportListeners: ((event: unknown) => void)[] = [];
jest.mock('./import', () => ({
    IMPORT: 'import',
    notifyListeners: jest.fn(),
    addImportListener: (listener: (event: unknown) => void) =>
        mockImportListeners.push(listener),
    removeImportListener: (listener: (event: unknown) => void) =>
        mockImportListeners.splice(mockImportListeners.indexOf(listener), 1),
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

describe('stopImport', () => {
    const ctx = { tenant: 'tools-spec' } as any;
    const endImport = (tenant: string) =>
        [...mockImportListeners].forEach((listener) =>
            listener({
                room: `${tenant}-import`,
                data: { isImporting: false },
            }),
        );

    beforeEach(() => {
        jest.clearAllMocks();
        mockActiveJobs.length = 0;
        mockImportListeners.length = 0;
    });

    it('cancels the active import and waits for its end', async () => {
        const moveToFailed = jest.fn();
        mockActiveJobs.push({ data: { jobType: 'import' }, moveToFailed });
        let isStopped = false;

        const stopping = stopImport(ctx).then(() => {
            isStopped = true;
        });
        await new Promise(setImmediate);
        expect(moveToFailed).toHaveBeenCalled();
        endImport('another-tenant');
        await new Promise(setImmediate);
        expect(isStopped).toBe(false);

        endImport(ctx.tenant);
        await stopping;
        expect(mockImportListeners).toHaveLength(0);
    });

    it('stops waiting for an import that does not end', async () => {
        mockActiveJobs.push({
            data: { jobType: 'import' },
            moveToFailed: jest.fn(),
        });

        await stopImport(ctx, 10);

        expect(mockImportListeners).toHaveLength(0);
    });

    it('removes the waiting imports and leaves another job alone', async () => {
        const moveToFailed = jest.fn();
        mockActiveJobs.push({ data: { jobType: 'enricher' }, moveToFailed });

        await stopImport(ctx);

        expect(cleanWaitingJobsOfType).toHaveBeenCalledWith(
            ctx.tenant,
            'import',
        );
        expect(moveToFailed).not.toHaveBeenCalled();
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
