import {
    importWizardModel,
    onWizardImportEnd,
    startWizardGeneration,
} from './wizardGeneration';
import { failWizardGeneration } from './wizardJobs';

jest.mock('../modelRestore', () => ({
    restoreFields: jest.fn(),
    applyRecommendedTheme: jest.fn(),
    applySiteInfo: jest.fn(),
}));
import {
    applyRecommendedTheme,
    applySiteInfo,
    restoreFields,
} from '../modelRestore';

const mockAdd = jest.fn();
jest.mock('../../workers', () => ({
    getOrCreateWorkerQueue: () => ({ add: mockAdd }),
}));

jest.mock('./siteGeneration', () => ({
    stopSiteGeneration: jest.fn(),
    advanceSiteGeneration: jest.fn(),
}));
import { advanceSiteGeneration, stopSiteGeneration } from './siteGeneration';

jest.mock('../logger', () => {
    const logger = { error: jest.fn(), info: jest.fn(), warn: jest.fn() };
    return { __esModule: true, default: () => logger };
});
import getLogger from '../logger';
const mockLogger = getLogger('lodex_test');

const catalogModels = [
    {
        id: 'good',
        name: 'Good model',
        url: 'https://host/models/good.tar',
        launchOrder: [
            { name: 'a', type: 'enrichment', position: 0 },
            { name: 'b', type: 'precomputed', position: 1 },
            { name: 'c', type: 'enrichment', position: 2 },
        ],
    },
    { id: 'plain', name: 'Plain', url: 'https://host/models/plain.tar' },
    {
        id: 'themed',
        name: 'Themed',
        url: 'https://host/models/themed.tar',
        theme: 'hal-cnrs',
        launchOrder: [{ name: 'a', type: 'enrichment', position: 0 }],
    },
    { id: 'zip', name: 'Zip', url: 'https://host/models/zip.zip' },
];

jest.mock('../catalogModel', () => ({
    findCatalogModel: (models: any[], id: string) =>
        models.find((model) => model.id === id) ?? null,
}));

describe('startWizardGeneration', () => {
    const startWizard = jest.fn();
    const ctx: any = {
        tenant: 'lodex_test',
        catalogModels,
        availableLoaders: [],
        siteGeneration: { startWizard },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        startWizard.mockResolvedValue({ runId: 'run-1' });
    });

    it('starts a data phase generation with the estimate of the model', async () => {
        const choice = { modelId: 'good', siteName: 'Site' };
        const result = await startWizardGeneration(ctx, choice, 'job-1');
        expect(result).toEqual({ runId: 'run-1' });
        expect(startWizard).toHaveBeenCalledWith({
            choice,
            importJobId: 'job-1',
            estimate: { enrichment: 2, precomputed: 1 },
            // shown, waiting, until the launch reads the steps of the site
            plannedSteps: [
                { name: 'a', type: 'enrichment', position: 0 },
                { name: 'b', type: 'precomputed', position: 1 },
                { name: 'c', type: 'enrichment', position: 2 },
            ],
        });
    });

    it('has no estimate without launchOrder', async () => {
        await startWizardGeneration(ctx, { modelId: 'plain' }, 'job-1');
        expect(startWizard.mock.calls[0][0].estimate).toBeUndefined();
    });

    it('refuses an unknown model', async () => {
        const result = await startWizardGeneration(
            ctx,
            { modelId: 'nope' },
            'job-1',
        );
        expect(result).toEqual({ status: 404, error: 'model_not_found' });
        expect(startWizard).not.toHaveBeenCalled();
        expect(stopSiteGeneration).not.toHaveBeenCalled();
    });

    it('refuses an archive which is not a tar', async () => {
        const result = await startWizardGeneration(
            ctx,
            { modelId: 'zip' },
            'job-1',
        );
        expect(result).toEqual({ status: 400, error: 'model_archive_not_tar' });
        expect(startWizard).not.toHaveBeenCalled();
    });

    it('stops the current generation before starting', async () => {
        const order: string[] = [];
        (stopSiteGeneration as jest.Mock).mockImplementation(async () => {
            order.push('stop');
            return true;
        });
        startWizard.mockImplementation(async () => {
            order.push('start');
            return { runId: 'run-2' };
        });
        await startWizardGeneration(ctx, { modelId: 'good' }, 'job-1');
        expect(stopSiteGeneration).toHaveBeenCalledWith(ctx);
        expect(order).toEqual(['stop', 'start']);
    });
});

describe('failWizardGeneration', () => {
    const transition = jest.fn();
    const makeCtx = (current: unknown) =>
        ({
            tenant: 'lodex_test',
            siteGeneration: {
                findCurrent: jest.fn().mockResolvedValue(current),
                transition,
            },
        }) as any;

    beforeEach(() => jest.clearAllMocks());

    it('puts the run in error with the message', async () => {
        const current = { runId: 'run-1' };
        await failWizardGeneration(makeCtx(current), 'run-1', 'boom');
        expect(transition).toHaveBeenCalledWith(current, {
            status: 'error',
            message: 'boom',
        });
    });

    it('leaves another run alone', async () => {
        await failWizardGeneration(makeCtx({ runId: 'other' }), 'run-1', 'x');
        expect(transition).not.toHaveBeenCalled();
    });
});

describe('onWizardImportEnd', () => {
    const make = (current: any) => {
        const state = { current };
        const transition = jest.fn(async (cur: any, update: any) => {
            if (state.current.version !== cur.version) return null;
            state.current = {
                ...state.current,
                ...update,
                version: cur.version + 1,
            };
            return state.current;
        });
        const ctx: any = {
            tenant: 'lodex_test',
            dataset: {
                estimatedDocumentCount: jest.fn().mockResolvedValue(42),
            },
            siteGeneration: {
                findCurrent: jest.fn(async () => state.current),
                transition,
            },
        };
        return { ctx, state, transition };
    };
    const running = {
        runId: 'run-1',
        status: 'running',
        phase: 'data',
        version: 1,
    };

    beforeEach(() => jest.clearAllMocks());

    it('moves to the model phase and queues the model import', async () => {
        const { ctx, state } = make({ ...running });
        await onWizardImportEnd(ctx, 'run-1', { success: true });
        expect(state.current.phase).toBe('model');
        expect(state.current.importedLines).toBe(42);
        expect(mockAdd).toHaveBeenCalledTimes(1);
        expect(mockAdd).toHaveBeenCalledWith(
            'model-importer',
            {
                jobType: 'model-importer',
                tenant: 'lodex_test',
                runId: 'run-1',
            },
            { jobId: state.current.modelJobId, lifo: false },
        );
        expect(state.current.modelJobId).toEqual(expect.any(String));
    });

    describe('data add', () => {
        const addData = {
            ...running,
            kind: 'addData',
            position: 0,
            steps: [
                { name: 'b', type: 'precomputed', position: 2 },
                { name: 'a', type: 'enrichment', position: 1 },
            ],
        };

        it('moves to the launch phase at the first position, queues no model job and advances', async () => {
            const { ctx, state } = make({ ...addData });
            await onWizardImportEnd(ctx, 'run-1', { success: true });
            expect(state.current.phase).toBe('launch');
            expect(state.current.importedLines).toBe(42);
            expect(state.current.position).toBe(1);
            expect(state.current.modelJobId).toBeUndefined();
            expect(mockAdd).not.toHaveBeenCalled();
            expect(advanceSiteGeneration).toHaveBeenCalledWith(ctx);
        });

        it('starts at position 0 without any step', async () => {
            const { ctx, state } = make({ ...addData, steps: [] });
            await onWizardImportEnd(ctx, 'run-1', { success: true });
            expect(state.current.phase).toBe('launch');
            expect(state.current.position).toBe(0);
            expect(advanceSiteGeneration).toHaveBeenCalledWith(ctx);
        });

        it('only logs a failure of the advance', async () => {
            jest.mocked(advanceSiteGeneration).mockRejectedValueOnce(
                new Error('advance boom'),
            );
            const { ctx, state } = make({ ...addData });
            await onWizardImportEnd(ctx, 'run-1', { success: true });
            expect(state.current.status).toBe('running');
            expect(mockLogger.error).toHaveBeenCalledWith(
                'Site generation advance error',
                { error: 'advance boom' },
            );
        });

        it('launches without importedLines when the count fails', async () => {
            const { ctx, state } = make({ ...addData });
            ctx.dataset.estimatedDocumentCount.mockRejectedValue(
                new Error('count boom'),
            );
            await onWizardImportEnd(ctx, 'run-1', { success: true });
            expect(state.current.phase).toBe('launch');
            expect(state.current.status).toBe('running');
            expect(state.current.importedLines).toBeUndefined();
            expect(state.current.position).toBe(1);
            expect(advanceSiteGeneration).toHaveBeenCalledWith(ctx);
        });

        it('puts the run in error in its launch phase when the transition fails', async () => {
            const { ctx, state, transition } = make({ ...addData });
            transition.mockRejectedValueOnce(new Error('transition boom'));
            await onWizardImportEnd(ctx, 'run-1', { success: true });
            expect(state.current).toMatchObject({
                status: 'error',
                phase: 'launch',
                position: 1,
                message: 'transition boom',
            });
            expect(state.current.steps).toEqual(addData.steps);
            expect(advanceSiteGeneration).not.toHaveBeenCalled();
        });

        it('leaves a run stopped meanwhile alone when the transition fails', async () => {
            const { ctx, state, transition } = make({ ...addData });
            transition.mockImplementationOnce(async () => {
                state.current = { ...state.current, status: 'stopping' };
                throw new Error('transition boom');
            });
            await onWizardImportEnd(ctx, 'run-1', { success: true });
            expect(state.current.status).toBe('stopping');
            expect(state.current.phase).toBe('data');
            expect(advanceSiteGeneration).not.toHaveBeenCalled();
        });

        it('advances without putting the run in error when the transition was committed though it threw', async () => {
            const { ctx, state, transition } = make({ ...addData });
            transition.mockImplementationOnce(async () => {
                state.current = { ...state.current, phase: 'launch' };
                throw new Error('transition boom');
            });
            await onWizardImportEnd(ctx, 'run-1', { success: true });
            expect(state.current.status).toBe('running');
            expect(state.current.phase).toBe('launch');
            expect(advanceSiteGeneration).toHaveBeenCalledWith(ctx);
        });

        it('puts the run in error on failure', async () => {
            const { ctx, state } = make({ ...addData });
            await onWizardImportEnd(ctx, 'run-1', {
                success: false,
                cancelled: false,
                message: 'import_error_invalid_format',
            });
            expect(state.current.status).toBe('error');
            expect(state.current.message).toBe('import_error_invalid_format');
            expect(advanceSiteGeneration).not.toHaveBeenCalled();
        });

        it('stops the run on cancellation', async () => {
            const { ctx, state } = make({ ...addData });
            await onWizardImportEnd(ctx, 'run-1', {
                success: false,
                cancelled: true,
                message: 'cancelled_import',
            });
            expect(state.current.status).toBe('stopped');
        });
    });

    it('queues only once for concurrent calls', async () => {
        const { ctx } = make({ ...running });
        await Promise.all([
            onWizardImportEnd(ctx, 'run-1', { success: true }),
            onWizardImportEnd(ctx, 'run-1', { success: true }),
        ]);
        expect(mockAdd).toHaveBeenCalledTimes(1);
    });

    it('puts the run in error on failure, with the detail of the error', async () => {
        const { ctx, state } = make({ ...running });
        await onWizardImportEnd(ctx, 'run-1', {
            success: false,
            cancelled: false,
            message: 'import_error_invalid_format',
            detail: 'bad file',
        });
        expect(state.current.status).toBe('error');
        expect(state.current.message).toBe('import_error_invalid_format');
        expect(state.current.detail).toBe('bad file');
        expect(mockAdd).not.toHaveBeenCalled();
    });

    it('stops the run on cancellation', async () => {
        const { ctx, state } = make({ ...running });
        await onWizardImportEnd(ctx, 'run-1', {
            success: false,
            cancelled: true,
            message: 'cancelled_import',
        });
        expect(state.current.status).toBe('stopped');
    });

    it('does nothing on cancellation of an already stopped run', async () => {
        const { ctx, transition } = make({ ...running, status: 'stopped' });
        await onWizardImportEnd(ctx, 'run-1', {
            success: false,
            cancelled: true,
            message: 'cancelled_import',
        });
        expect(transition).not.toHaveBeenCalled();
    });

    it('puts the run in error when the count fails', async () => {
        const { ctx, state } = make({ ...running });
        ctx.dataset.estimatedDocumentCount.mockRejectedValue(
            new Error('count boom'),
        );
        await onWizardImportEnd(ctx, 'run-1', { success: true });
        expect(state.current.status).toBe('error');
        expect(state.current.message).toBe('count boom');
        expect(mockAdd).not.toHaveBeenCalled();
    });

    it('puts the run in error when queueing fails after the transition', async () => {
        const { ctx, state } = make({ ...running });
        mockAdd.mockRejectedValueOnce(new Error('queue boom'));
        await onWizardImportEnd(ctx, 'run-1', { success: true });
        expect(state.current.status).toBe('error');
        expect(state.current.message).toBe('queue boom');
    });

    it('leaves another run alone', async () => {
        const { ctx, transition } = make({ ...running, runId: 'other' });
        await onWizardImportEnd(ctx, 'run-1', { success: true });
        expect(transition).not.toHaveBeenCalled();
        expect(mockAdd).not.toHaveBeenCalled();
    });

    it('does nothing without a runId (manual import)', async () => {
        const { ctx, transition } = make({ ...running });
        await onWizardImportEnd(ctx, undefined, { success: true });
        expect(transition).not.toHaveBeenCalled();
        expect(mockAdd).not.toHaveBeenCalled();
    });

    it('does nothing outside the data phase', async () => {
        const { ctx, transition } = make({ ...running, phase: 'launch' });
        await onWizardImportEnd(ctx, 'run-1', { success: true });
        expect(transition).not.toHaveBeenCalled();
    });
});

describe('importWizardModel', () => {
    const stream = { filename: 'good.tar' };
    const make = (current: any) => {
        const state = { current };
        const transition = jest.fn(async (cur: any, update: any) => {
            if (
                state.current.runId !== cur.runId ||
                state.current.version !== cur.version
            ) {
                return null;
            }
            state.current = {
                ...state.current,
                ...update,
                version: cur.version + 1,
            };
            return state.current;
        });
        // Another process (« Arrêter ») moves the generation to stopping
        const stopNow = () => {
            state.current = {
                ...state.current,
                status: 'stopping',
                version: state.current.version + 1,
            };
        };
        jest.mocked(restoreFields).mockResolvedValue({});
        jest.mocked(applyRecommendedTheme).mockResolvedValue({});
        jest.mocked(applySiteInfo).mockResolvedValue(undefined);
        const ctx: any = {
            tenant: 'lodex_test',
            catalogModels,
            availableLoaders: [],
            downloadModelArchive: jest.fn().mockResolvedValue(stream),
            enrichment: {
                findAll: jest.fn().mockResolvedValue([
                    { _id: 'ea', name: 'a' },
                    { _id: 'ec', name: 'c' },
                ]),
            },
            precomputed: {
                findAll: jest
                    .fn()
                    .mockResolvedValue([{ _id: 'pb', name: 'b' }]),
            },
            dataSource: { getDataSources: jest.fn().mockResolvedValue([]) },
            siteGeneration: {
                findCurrent: jest.fn(async () => state.current),
                transition,
            },
            siteModel: { remember: jest.fn(), forget: jest.fn() },
        };
        return { ctx, state, transition, stopNow };
    };
    const inModelPhase = (choice: object = {}) => ({
        runId: 'run-1',
        status: 'running',
        phase: 'model',
        steps: [],
        position: 0,
        version: 3,
        choice: { modelId: 'good', ...choice },
    });

    beforeEach(() => {
        jest.clearAllMocks();
        (advanceSiteGeneration as jest.Mock).mockResolvedValue(undefined);
    });

    it('restores the model and moves to the launch phase with its steps', async () => {
        const { ctx, state } = make(inModelPhase());
        await importWizardModel(ctx, 'run-1');

        expect(ctx.downloadModelArchive).toHaveBeenCalledWith(
            'https://host/models/good.tar',
        );
        expect(restoreFields).toHaveBeenCalledWith(stream, ctx);
        expect(state.current).toMatchObject({
            status: 'running',
            phase: 'launch',
            position: 0,
        });
        expect(state.current.steps).toEqual([
            expect.objectContaining({ name: 'a', targetId: 'ea', position: 0 }),
            expect.objectContaining({ name: 'b', targetId: 'pb', position: 1 }),
            expect.objectContaining({ name: 'c', targetId: 'ec', position: 2 }),
        ]);
        expect(state.current).not.toHaveProperty('themeNotFound');
        // the first position starts without waiting for the periodic pass
        expect(advanceSiteGeneration).toHaveBeenCalledWith(ctx);
    });

    it('goes through the settings phase before the launch phase', async () => {
        const { ctx, transition } = make(inModelPhase());
        await importWizardModel(ctx, 'run-1');

        expect(transition.mock.calls.map(([, update]) => update.phase)).toEqual(
            ['settings', 'launch'],
        );
        expect(transition.mock.invocationCallOrder[0]).toBeGreaterThan(
            jest.mocked(restoreFields).mock.invocationCallOrder[0],
        );
        expect(transition.mock.invocationCallOrder[0]).toBeLessThan(
            jest.mocked(applySiteInfo).mock.invocationCallOrder[0],
        );
    });

    it('remembers the restored model before the settings phase', async () => {
        const { ctx, transition } = make(inModelPhase());
        await importWizardModel(ctx, 'run-1');

        expect(ctx.siteModel.remember).toHaveBeenCalledTimes(1);
        expect(ctx.siteModel.remember).toHaveBeenCalledWith('good');
        const remembered = ctx.siteModel.remember.mock.invocationCallOrder[0];
        expect(remembered).toBeGreaterThan(
            jest.mocked(restoreFields).mock.invocationCallOrder[0],
        );
        expect(remembered).toBeLessThan(transition.mock.invocationCallOrder[0]);
    });

    it('forgets the memory before the restoration, even when it fails', async () => {
        const { ctx } = make(inModelPhase());
        jest.mocked(restoreFields).mockRejectedValue(new Error('bad archive'));
        await importWizardModel(ctx, 'run-1');
        expect(ctx.siteModel.forget).toHaveBeenCalledTimes(1);
        expect(ctx.siteModel.forget.mock.invocationCallOrder[0]).toBeLessThan(
            jest.mocked(restoreFields).mock.invocationCallOrder[0],
        );
    });

    it('does not forget the memory when the download fails', async () => {
        const { ctx } = make(inModelPhase());
        ctx.downloadModelArchive.mockRejectedValue(new Error('offline'));
        await importWizardModel(ctx, 'run-1');
        expect(ctx.siteModel.forget).not.toHaveBeenCalled();
    });

    it('does not remember the model when the download fails', async () => {
        const { ctx } = make(inModelPhase());
        ctx.downloadModelArchive.mockRejectedValue(new Error('offline'));
        await importWizardModel(ctx, 'run-1');
        expect(ctx.siteModel.remember).not.toHaveBeenCalled();
    });

    it('remembers only after a successful restore: not when the restoration fails', async () => {
        const { ctx } = make(inModelPhase());
        jest.mocked(restoreFields).mockRejectedValue(new Error('bad archive'));
        await importWizardModel(ctx, 'run-1');
        expect(ctx.siteModel.remember).not.toHaveBeenCalled();
    });

    it('does not remember the model when stopped during the download', async () => {
        const { ctx, stopNow } = make(inModelPhase());
        ctx.downloadModelArchive.mockImplementation(async () => {
            stopNow();
            return stream;
        });
        await importWizardModel(ctx, 'run-1');
        expect(ctx.siteModel.remember).not.toHaveBeenCalled();
    });

    // the launch phase then ends it, or publishes the site first
    it('hands a model without step to launch over to the launch phase', async () => {
        const { ctx, state } = make(inModelPhase());
        ctx.enrichment.findAll.mockResolvedValue([]);
        ctx.precomputed.findAll.mockResolvedValue([]);
        await importWizardModel(ctx, 'run-1');

        expect(state.current).toMatchObject({
            status: 'running',
            phase: 'launch',
            steps: [],
        });
        expect(advanceSiteGeneration).toHaveBeenCalledWith(ctx);
    });

    it('applies the chosen theme, then the site name and description', async () => {
        const { ctx } = make(
            inModelPhase({
                modelId: 'themed',
                theme: 'nougat',
                siteName: 'My site',
                siteDescription: 'About',
            }),
        );
        await importWizardModel(ctx, 'run-1');

        expect(applyRecommendedTheme).toHaveBeenCalledTimes(1);
        expect(applyRecommendedTheme).toHaveBeenCalledWith(ctx, 'nougat');
        expect(applySiteInfo).toHaveBeenCalledWith(ctx, {
            siteName: 'My site',
            siteDescription: 'About',
        });
        expect(
            jest.mocked(applyRecommendedTheme).mock.invocationCallOrder[0],
        ).toBeLessThan(jest.mocked(applySiteInfo).mock.invocationCallOrder[0]);
    });

    it('applies the catalog theme without a chosen one', async () => {
        const { ctx } = make(inModelPhase({ modelId: 'themed' }));
        await importWizardModel(ctx, 'run-1');
        expect(applyRecommendedTheme).toHaveBeenCalledWith(ctx, 'hal-cnrs');
    });

    it('keeps a theme not found and goes on', async () => {
        const { ctx, state } = make(inModelPhase({ modelId: 'themed' }));
        jest.mocked(restoreFields).mockResolvedValue({
            themeNotFound: 'archive',
        });
        jest.mocked(applyRecommendedTheme).mockResolvedValue({
            themeNotFound: 'hal-cnrs',
        });
        await importWizardModel(ctx, 'run-1');

        expect(state.current).toMatchObject({
            status: 'running',
            phase: 'launch',
            themeNotFound: 'hal-cnrs',
        });
    });

    it('keeps the theme of the archive not found when no theme is applied', async () => {
        const { ctx, state } = make(inModelPhase());
        jest.mocked(restoreFields).mockResolvedValue({
            themeNotFound: 'archive',
        });
        ctx.enrichment.findAll.mockResolvedValue([]);
        ctx.precomputed.findAll.mockResolvedValue([]);
        await importWizardModel(ctx, 'run-1');

        expect(applyRecommendedTheme).not.toHaveBeenCalled();
        expect(state.current).toMatchObject({
            phase: 'launch',
            themeNotFound: 'archive',
        });
    });

    it('logs a failed site info write and goes on', async () => {
        const { ctx, state } = make(inModelPhase({ siteName: 'S' }));
        jest.mocked(applySiteInfo).mockRejectedValue(new Error('write failed'));
        await importWizardModel(ctx, 'run-1');

        expect(mockLogger.error).toHaveBeenCalledWith(
            'Site info write error',
            expect.objectContaining({ error: 'write failed' }),
        );
        expect(state.current).toMatchObject({
            status: 'running',
            phase: 'launch',
        });
    });

    it('logs a failed first pass and keeps the launch phase', async () => {
        const { ctx, state } = make(inModelPhase());
        (advanceSiteGeneration as jest.Mock).mockRejectedValue(
            new Error('boom'),
        );
        await importWizardModel(ctx, 'run-1');

        expect(mockLogger.error).toHaveBeenCalledWith(
            'Site generation advance error',
            expect.objectContaining({ error: 'boom' }),
        );
        expect(state.current).toMatchObject({
            status: 'running',
            phase: 'launch',
        });
    });

    it('puts the generation in error in the model phase when the download fails', async () => {
        const { ctx, state } = make(inModelPhase());
        ctx.downloadModelArchive.mockRejectedValue(new Error('404 Not Found'));
        await importWizardModel(ctx, 'run-1');

        expect(state.current).toMatchObject({
            status: 'error',
            phase: 'model',
            message: '404 Not Found',
        });
        expect(restoreFields).not.toHaveBeenCalled();
    });

    it('puts the generation in error in the model phase when the restoration fails', async () => {
        const { ctx, state } = make(inModelPhase());
        jest.mocked(restoreFields).mockRejectedValue(
            new Error('restore failed'),
        );
        await importWizardModel(ctx, 'run-1');

        expect(state.current).toMatchObject({
            status: 'error',
            phase: 'model',
            message: 'restore failed',
        });
    });

    it('puts the generation in error when the model left the catalog', async () => {
        const { ctx, state } = make(inModelPhase({ modelId: 'gone' }));
        await importWizardModel(ctx, 'run-1');

        expect(state.current).toMatchObject({
            status: 'error',
            phase: 'model',
            message: 'model_not_found',
        });
        expect(ctx.downloadModelArchive).not.toHaveBeenCalled();
    });

    it('puts the generation in error in the settings phase when the theme fails', async () => {
        const { ctx, state } = make(inModelPhase({ modelId: 'themed' }));
        jest.mocked(applyRecommendedTheme).mockRejectedValue(
            new Error('theme boom'),
        );
        await importWizardModel(ctx, 'run-1');

        expect(state.current).toMatchObject({
            status: 'error',
            phase: 'settings',
            message: 'theme boom',
        });
        expect(advanceSiteGeneration).not.toHaveBeenCalled();
    });

    it('stops without queueing any step when stopped during the restoration', async () => {
        const { ctx, state, stopNow } = make(inModelPhase());
        jest.mocked(restoreFields).mockImplementation(async () => {
            stopNow();
            return {};
        });
        await importWizardModel(ctx, 'run-1');

        expect(state.current).toMatchObject({
            status: 'stopped',
            phase: 'model',
            steps: [],
        });
        expect(applyRecommendedTheme).not.toHaveBeenCalled();
        expect(advanceSiteGeneration).not.toHaveBeenCalled();
    });

    it('stops without restoring when stopped during the download', async () => {
        const { ctx, state, stopNow } = make(inModelPhase());
        ctx.downloadModelArchive.mockImplementation(async () => {
            stopNow();
            return stream;
        });
        await importWizardModel(ctx, 'run-1');

        expect(state.current).toMatchObject({
            status: 'stopped',
            phase: 'model',
        });
        expect(restoreFields).not.toHaveBeenCalled();
        expect(advanceSiteGeneration).not.toHaveBeenCalled();
    });

    it('stops without queueing any step when stopped during the settings', async () => {
        const { ctx, state, stopNow } = make(inModelPhase({ siteName: 'S' }));
        jest.mocked(applySiteInfo).mockImplementation(async () => stopNow());
        await importWizardModel(ctx, 'run-1');

        expect(state.current).toMatchObject({
            status: 'stopped',
            phase: 'settings',
            steps: [],
        });
        expect(advanceSiteGeneration).not.toHaveBeenCalled();
    });

    it('stops when stopped while a failure is written', async () => {
        const { ctx, state, stopNow } = make(inModelPhase());
        jest.mocked(restoreFields).mockImplementation(async () => {
            stopNow();
            throw new Error('restore failed');
        });
        await importWizardModel(ctx, 'run-1');

        expect(state.current.status).toBe('stopped');
    });

    it('stops at once a generation already stopping', async () => {
        const { ctx, state } = make({
            ...inModelPhase(),
            status: 'stopping',
        });
        await importWizardModel(ctx, 'run-1');

        expect(state.current.status).toBe('stopped');
        expect(ctx.downloadModelArchive).not.toHaveBeenCalled();
        expect(advanceSiteGeneration).not.toHaveBeenCalled();
    });

    it('leaves another run alone', async () => {
        const { ctx, transition } = make(inModelPhase());
        await importWizardModel(ctx, 'run-2');

        expect(transition).not.toHaveBeenCalled();
        expect(ctx.downloadModelArchive).not.toHaveBeenCalled();
    });

    it('does nothing outside the model phase', async () => {
        const { ctx, transition } = make({
            ...inModelPhase(),
            phase: 'launch',
        });
        await importWizardModel(ctx, 'run-1');

        expect(transition).not.toHaveBeenCalled();
        expect(ctx.downloadModelArchive).not.toHaveBeenCalled();
    });

    it('does nothing for a generation which is not running', async () => {
        const { ctx, transition } = make({
            ...inModelPhase(),
            status: 'stopped',
        });
        await importWizardModel(ctx, 'run-1');

        expect(transition).not.toHaveBeenCalled();
        expect(ctx.downloadModelArchive).not.toHaveBeenCalled();
    });

    it('does nothing without a generation', async () => {
        const { ctx, transition } = make(null);
        await importWizardModel(ctx, 'run-1');

        expect(transition).not.toHaveBeenCalled();
    });
});
