const mockImportWizardModel = jest.fn();
const mockFailWizardGeneration = jest.fn();
jest.mock('../services/siteGeneration/wizardGeneration', () => ({
    importWizardModel: (...args: unknown[]) => mockImportWizardModel(...args),
}));
jest.mock('../services/siteGeneration/wizardJobs', () => ({
    MODEL_IMPORTER: 'model-importer',
    failWizardGeneration: (...args: unknown[]) =>
        mockFailWizardGeneration(...args),
}));
const mockRepositoryMiddleware = jest.fn(async (ctx: any, next: any) => {
    ctx.siteGeneration = { repository: true };
    return next();
});
jest.mock('../services/repositoryMiddleware', () => ({
    __esModule: true,
    default: (ctx: any, next: any) => mockRepositoryMiddleware(ctx, next),
}));
jest.mock('../services/catalogModel', () => ({
    catalogModels: [{ id: 'model' }],
    downloadModelArchive: jest.fn(),
}));
const mockLogger = { error: jest.fn(), warn: jest.fn(), info: jest.fn() };
jest.mock('../services/logger', () => () => mockLogger);

import config from 'config';
import { catalogModels, downloadModelArchive } from '../services/catalogModel';
import { processModelImport } from './modelImport';

const run = (job: any) =>
    new Promise<any>((resolve) => processModelImport(job, resolve));

const job = {
    data: { tenant: 'lodex_test', runId: 'run-1', jobType: 'model-importer' },
};

describe('processModelImport', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFailWizardGeneration.mockResolvedValue(undefined);
    });

    it('imports the model of the run with a prepared context', async () => {
        mockImportWizardModel.mockResolvedValue(undefined);
        const result = await run(job);

        expect(result).toBeUndefined();
        expect(mockImportWizardModel).toHaveBeenCalledWith(
            expect.objectContaining({
                tenant: 'lodex_test',
                siteGeneration: { repository: true },
                catalogModels,
                availableLoaders: config.get('scripts.loaders'),
                downloadModelArchive,
            }),
            'run-1',
        );
    });

    it('logs an unexpected failure and fails the job', async () => {
        const error = new Error('boom');
        mockImportWizardModel.mockRejectedValue(error);
        const result = await run(job);

        expect(result).toBe(error);
        expect(mockLogger.error).toHaveBeenCalledWith(
            'Model import error',
            expect.objectContaining({ error: 'boom' }),
        );
    });

    it('fails the generation of the run on an unexpected failure', async () => {
        mockImportWizardModel.mockRejectedValue(new Error('db down'));
        await run(job);

        expect(mockFailWizardGeneration).toHaveBeenCalledWith(
            expect.objectContaining({ siteGeneration: { repository: true } }),
            'run-1',
            'db down',
        );
    });

    it('prepares the context again to fail the generation when it could not be prepared', async () => {
        mockRepositoryMiddleware.mockRejectedValueOnce(new Error('no db'));
        const result = await run(job);

        expect(result).toEqual(new Error('no db'));
        expect(mockImportWizardModel).not.toHaveBeenCalled();
        expect(mockFailWizardGeneration).toHaveBeenCalledWith(
            expect.objectContaining({ siteGeneration: { repository: true } }),
            'run-1',
            'no db',
        );
    });

    it('logs and skips the failure write when no context can be prepared', async () => {
        mockRepositoryMiddleware
            .mockRejectedValueOnce(new Error('no db'))
            .mockRejectedValueOnce(new Error('no db'));
        const result = await run(job);

        expect(result).toEqual(new Error('no db'));
        expect(mockFailWizardGeneration).not.toHaveBeenCalled();
        expect(mockLogger.error).toHaveBeenCalledWith(
            'Model import failure write error',
            expect.objectContaining({ error: 'no db' }),
        );
    });

    it('calls done once when done throws', async () => {
        mockImportWizardModel.mockResolvedValue(undefined);
        const done = jest.fn(() => {
            throw new Error('done boom');
        });
        processModelImport(job, done);
        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(done).toHaveBeenCalledTimes(1);
    });
});
