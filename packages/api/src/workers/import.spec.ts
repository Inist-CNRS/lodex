const mockOnWizardImportEnd = jest.fn();
const mockStartImport = jest.fn();
const mockDrop = jest.fn();
const mockRepositoryMiddleware = jest.fn();
jest.mock('../services/siteGeneration/wizardGeneration', () => ({
    onWizardImportEnd: (...args: unknown[]) => mockOnWizardImportEnd(...args),
}));
const mockDiscardQueuedImport = jest.fn();
jest.mock('../services/import', () => ({
    startImport: (...args: unknown[]) => mockStartImport(...args),
    discardQueuedImport: (...args: unknown[]) =>
        mockDiscardQueuedImport(...args),
    getLoader: jest.fn(),
    getStreamFromUrl: jest.fn(),
    getCustomLoader: jest.fn(),
    getStreamFromText: jest.fn(),
}));
jest.mock('../services/repositoryMiddleware', () => ({
    __esModule: true,
    default: async (ctx: any, next: any) => {
        await mockRepositoryMiddleware(ctx);
        ctx.dataset = { drop: mockDrop };
        ctx.siteGeneration = {};
        return next();
    },
    invalidateRepositories: jest.fn(),
}));
jest.mock('../services/fsHelpers', () => ({}));
jest.mock('@ezs/core/fusible', () => ({
    createFusible: async () => 'fusible',
    enableFusible: jest.fn(),
    disableFusible: jest.fn(),
}));
jest.mock('../services/saveParsedStream', () => ({}));
jest.mock('../services/publishDocuments', () => jest.fn());
jest.mock('../controller/api/publishFacets', () => jest.fn());
jest.mock('../services/saveStream', () => jest.fn());
jest.mock('../services/logger', () => () => ({
    warn: jest.fn(),
    error: jest.fn(),
}));
jest.mock('./index', () => ({
    CancelWorkerError: class CancelWorkerError extends Error {},
    cleanWaitingJobsOfType: jest.fn(),
}));

import { cancelImportJob, processImport } from './import';
import { disableFusible } from '@ezs/core/fusible';
import { CancelWorkerError } from './index';

const run = (job: any) =>
    new Promise<any>((resolve) => processImport(job, resolve));

const makeJob = (data: object = {}, id = 1) => ({
    id,
    data: { tenant: 'lodex_test', siteGenerationRunId: 'run-1', ...data },
    progress: jest.fn(),
    isFailed: jest.fn().mockResolvedValue(false),
});

describe('processImport and the wizard generation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockOnWizardImportEnd.mockResolvedValue(undefined);
        mockDrop.mockResolvedValue(undefined);
        mockRepositoryMiddleware.mockResolvedValue(undefined);
    });

    it('ends a cancelled import once its dataset is dropped and the wizard notified', async () => {
        const events: string[] = [];
        mockDrop.mockImplementation(async () => {
            await new Promise((r) => setTimeout(r, 10));
            events.push('drop');
        });
        mockOnWizardImportEnd.mockImplementation(async () => {
            await new Promise((r) => setTimeout(r, 10));
            events.push('wizard');
        });
        mockStartImport.mockRejectedValue(new CancelWorkerError('x'));
        const err = await run(makeJob());
        events.push('done');
        expect(err).toBeInstanceOf(CancelWorkerError);
        expect(events).toEqual(['drop', 'wizard', 'done']);
    });

    it('keeps the dataset of a cancelled data add and still notifies the generation', async () => {
        mockStartImport.mockRejectedValue(new CancelWorkerError('x'));
        await run(makeJob({ keepDatasetOnCancel: true }));
        expect(mockDrop).not.toHaveBeenCalled();
        expect(mockOnWizardImportEnd).toHaveBeenCalledWith(
            expect.anything(),
            'run-1',
            { success: false, cancelled: true, message: 'cancelled_import' },
        );
    });

    it('drops the dataset of a cancelled import without the keep flag', async () => {
        mockStartImport.mockRejectedValue(new CancelWorkerError('x'));
        await run(makeJob());
        expect(mockDrop).toHaveBeenCalledTimes(1);
    });

    it('ends a failed import once even when its error handling fails', async () => {
        const err = new Error('bad file');
        mockStartImport.mockRejectedValue(err);
        const done = jest.fn();
        // the context of the error handling cannot be prepared
        mockRepositoryMiddleware
            .mockResolvedValueOnce(undefined)
            .mockRejectedValueOnce(new Error('no db'));
        await new Promise<void>((resolve) => {
            done.mockImplementation(() => resolve());
            processImport(makeJob(), done);
        });
        await new Promise((r) => setTimeout(r, 20));
        expect(done).toHaveBeenCalledTimes(1);
        expect(done).toHaveBeenCalledWith(err);
    });

    // a clear stops the import before dropping (see stopJobs)
    it('stops a running import through its fusible', async () => {
        let fusible: unknown;
        mockStartImport.mockImplementation(async (_ctx, givenFusible) => {
            fusible = givenFusible;
            await cancelImportJob(7);
        });
        await run(makeJob({}, 7));
        expect(fusible).toBe('fusible');
        expect(disableFusible).toHaveBeenCalledWith('fusible');
    });

    // its job does not store its fusible yet: the cancel waits for it
    it('cancels an import before it starts', async () => {
        await cancelImportJob(8);
        const err = await run(makeJob({}, 8));
        expect(err).toBeInstanceOf(CancelWorkerError);
        expect(mockStartImport).not.toHaveBeenCalled();
        expect(mockDiscardQueuedImport).toHaveBeenCalled();
    });

    it('does not cancel another import job', async () => {
        await cancelImportJob(9);
        mockStartImport.mockResolvedValue(undefined);
        await run(makeJob({}, 10));
        expect(mockStartImport).toHaveBeenCalled();
    });

    it('notifies the end of a successful import', async () => {
        mockStartImport.mockResolvedValue(undefined);
        await run(makeJob());
        expect(mockOnWizardImportEnd).toHaveBeenCalledWith(
            expect.anything(),
            'run-1',
            { success: true },
        );
    });

    // the code explaining the error to the user (see getImportError), and
    // the technical error
    it('notifies a failed import with its error code and detail', async () => {
        const err = new Error('bad file');
        mockStartImport.mockRejectedValue(err);
        await run(makeJob());
        await new Promise((r) => setTimeout(r, 20));
        expect(mockOnWizardImportEnd).toHaveBeenCalledWith(
            expect.anything(),
            'run-1',
            {
                success: false,
                cancelled: false,
                message: 'import_error_unknown',
                detail: 'bad file',
            },
        );
    });

    it('notifies a cancelled import', async () => {
        mockStartImport.mockRejectedValue(new CancelWorkerError('x'));
        await run(makeJob());
        await new Promise((r) => setTimeout(r, 20));
        expect(mockOnWizardImportEnd).toHaveBeenCalledWith(
            expect.anything(),
            'run-1',
            { success: false, cancelled: true, message: 'cancelled_import' },
        );
    });

    it('notifies an upload cancelled after its import was queued as cancelled', async () => {
        // startImport refuses the chunks of a cancelled upload
        mockStartImport.mockRejectedValue(new Error('cancelled_import'));
        await run(makeJob());
        await new Promise((r) => setTimeout(r, 20));
        expect(mockOnWizardImportEnd).toHaveBeenCalledWith(
            expect.anything(),
            'run-1',
            { success: false, cancelled: true, message: 'cancelled_import' },
        );
    });

    it('leaves the generation alone for an import without a run', async () => {
        mockStartImport.mockResolvedValue(undefined);
        await run(makeJob({ siteGenerationRunId: undefined }));
        expect(mockOnWizardImportEnd).not.toHaveBeenCalled();
    });

    it('does not change the import result when the wizard notification fails', async () => {
        mockStartImport.mockResolvedValue(undefined);
        mockOnWizardImportEnd.mockRejectedValue(new Error('boom'));
        const err = await run(makeJob());
        expect(err).toBeUndefined();
    });
});
