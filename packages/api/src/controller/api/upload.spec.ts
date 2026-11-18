import type { Queue } from 'bull';
import config from 'config';
import progress from '../../services/progress';
import { getOrCreateWorkerQueue } from '../../workers';
import { IMPORT } from '../../workers/import';
import { ProgressStatus } from '@lodex/common';
import {
    cancelUpload,
    parseRequest,
    uploadChunkMiddleware,
    uploadText,
    uploadUrl,
} from './upload';

jest.mock('../../workers');
jest.mock('../../services/siteGeneration/wizardGeneration');
import { startWizardGeneration } from '../../services/siteGeneration/wizardGeneration';
jest.mock('../../services/siteGeneration/dataAddGeneration');
import { startDataAddGeneration } from '../../services/siteGeneration/dataAddGeneration';
jest.mock('../../services/siteGeneration/wizardJobs');
import { failWizardGeneration } from '../../services/siteGeneration/wizardJobs';
jest.mock('node:crypto', () => ({
    ...jest.requireActual('node:crypto'),
    randomUUID: () => 'uuid',
}));

describe('upload', () => {
    beforeAll(async () => {
        progress.initialize('lodex_test');
    });

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
        jest.clearAllMocks();
    });

    describe('parseRequest', () => {
        const ctx = {
            tenant: 'lodex_test',
            req: 'req',
            requestToStream: jest.fn().mockImplementation(() => ({
                stream: 'stream',

                fields: {
                    resumableChunkNumber: '10',
                    resumableIdentifier: 'identifier',
                    resumableTotalChunks: '100',
                    resumableTotalSize: '500',
                    resumableCurrentChunkSize: '5',
                    resumableFilename: 'data.csv',
                },
            })),
            uploadFile: jest.fn(),
        };
        const next = jest.fn();

        it('should put info from resumable parsed request into ctx.resumable', async () => {
            await parseRequest(ctx, null, next);
            expect(ctx.requestToStream).toHaveBeenCalledWith('req');
            expect(next).toHaveBeenCalled();
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(ctx.resumable).toEqual({
                stream: 'stream',
                filename: `../../${config.get('uploadDir')}/lodex_test_identifier`,
                chunkNumber: 10,
                chunkname: `../../${config.get('uploadDir')}/lodex_test_identifier.10`,
                totalChunks: 100,
                totalSize: 500,
                currentChunkSize: 5,
                extension: 'csv',
                customLoader: null,
            });
        });
    });

    describe('parseRequest of a data add', () => {
        const parse = async (extra: Record<string, string>) => {
            const ctx: any = {
                tenant: 'lodex_test',
                req: 'req',
                requestToStream: jest.fn().mockResolvedValue({
                    stream: 'stream',
                    fields: {
                        resumableChunkNumber: '2',
                        resumableIdentifier: 'identifier',
                        resumableTotalChunks: '2',
                        resumableTotalSize: '10',
                        resumableCurrentChunkSize: '5',
                        resumableFilename: 'data.csv',
                        ...extra,
                    },
                }),
            };
            await parseRequest(ctx, null, jest.fn());
            return ctx;
        };

        it('reads the data add fields into ctx.resumable.dataAdd', async () => {
            const ctx = await parse({
                dataAdd: 'true',
                relaunch: 'true',
                autoPublish: 'false',
            });
            expect(ctx.resumable.dataAdd).toEqual({
                relaunch: 'true',
                autoPublish: 'false',
            });
            expect(ctx.resumable.choice).toBeUndefined();
        });

        it.each([
            ['missing', {}],
            ['false', { dataAdd: 'false', relaunch: 'true' }],
        ])('has no data add when the field is %s', async (_, extra) => {
            const ctx = await parse(extra);
            expect(ctx.resumable.dataAdd).toBeUndefined();
        });
    });

    describe('uploadChunkMiddleware', () => {
        describe('when chunk already exists but not all chunk are present', () => {
            const ctx = {
                tenant: 'lodex_test',
                isUploadCancelled: jest.fn(async () => false),
                markUploadQueued: jest.fn(),
                claimUploadImport: jest.fn(async () => true),
                getUploadedFileSize: jest.fn(() => 10),
                checkFileExists: jest.fn().mockImplementation(() => true),
                saveStreamInFile: jest.fn(),
                resumable: {
                    chunkname: 'chunkname',
                    filename: 'filename',
                    totalChunks: 'totalChunks',
                    totalSize: 'totalSize',
                    currentChunkSize: 'currentChunkSize',
                    stream: 'stream',
                },
            };

            const next = jest.fn();

            beforeEach(async () => {
                // @ts-expect-error TS(2554): Expected 2 arguments, but got 3.
                await uploadChunkMiddleware(ctx, 'type', next);
            });

            it('should have called checkFileExists', () => {
                expect(ctx.checkFileExists).toHaveBeenCalledWith(
                    'chunkname',
                    'currentChunkSize',
                );
            });

            it('should not have called saveStreamInFile', () => {
                expect(ctx.saveStreamInFile).not.toHaveBeenCalled();
            });

            it('should have called getUploadedFileSize', () => {
                expect(ctx.getUploadedFileSize).toHaveBeenCalledWith(
                    'filename',
                    'totalChunks',
                );
            });

            it('should not have called next', () => {
                expect(next).not.toHaveBeenCalled();
            });

            it('should have set ctx.status to 200', () => {
                // @ts-expect-error TS(2304): Cannot find name 'expect'.
                expect(ctx.status).toBe(200);
            });

            it('should not add job to the queue', () => {
                expect(workerQueue?.add).not.toBeDefined();
            });
        });

        describe('when chunk already exists and all chunk are present', () => {
            const ctx = {
                tenant: 'lodex_test',
                isUploadCancelled: jest.fn(async () => false),
                markUploadQueued: jest.fn(),
                claimUploadImport: jest.fn(async () => true),
                getUploadedFileSize: jest.fn(() => 10),
                checkFileExists: jest.fn().mockImplementation(() => true),
                saveStreamInFile: jest.fn(),
                resumable: {
                    extension: 'extension',
                    chunkname: 'chunkname',
                    filename: 'filename',
                    totalChunks: 'totalChunks',
                    totalSize: 10,
                    currentChunkSize: 'currentChunkSize',
                    stream: 'stream',
                },
            };

            const next = jest.fn();

            beforeEach(async () => {
                // @ts-expect-error TS(2554): Expected 2 arguments, but got 3.
                await uploadChunkMiddleware(ctx, 'type', next);
            });

            it('should have called checkFileExists', () => {
                expect(ctx.checkFileExists).toHaveBeenCalledWith(
                    'chunkname',
                    'currentChunkSize',
                );
            });

            it('should not have called saveStreamInFile', () => {
                expect(ctx.saveStreamInFile).not.toHaveBeenCalled();
            });

            it('should have called getUploadedFileSize', () => {
                expect(ctx.getUploadedFileSize).toHaveBeenCalledWith(
                    'filename',
                    'totalChunks',
                );
            });

            it('should mark the upload as queued', () => {
                expect(ctx.markUploadQueued).toHaveBeenCalledWith('filename');
            });

            it('should add job to the queue', () => {
                expect(workerQueue?.add).toHaveBeenCalledWith(
                    IMPORT,
                    {
                        extension: 'extension',
                        filename: 'filename',
                        jobType: IMPORT,
                        loaderName: 'type',
                        totalChunks: 'totalChunks',
                        customLoader: undefined,
                        tenant: 'lodex_test',
                    },
                    { jobId: 'uuid' },
                );
            });
        });

        describe('when chunk do not already exists and all chunk become present', () => {
            const ctx = {
                tenant: 'lodex_test',
                isUploadCancelled: jest.fn(async () => false),
                markUploadQueued: jest.fn(),
                claimUploadImport: jest.fn(async () => true),
                getUploadedFileSize: jest.fn(() => 10),
                checkFileExists: jest.fn().mockImplementation(() => false),
                saveStreamInFile: jest.fn(),
                resumable: {
                    extension: 'extension',
                    chunkname: 'chunkname',
                    filename: 'filename',
                    totalChunks: 'totalChunks',
                    totalSize: 10,
                    currentChunkSize: 'currentChunkSize',
                    stream: 'stream',
                },
            };

            const next = jest.fn();

            beforeEach(async () => {
                // @ts-expect-error TS(2554): Expected 2 arguments, but got 3.
                await uploadChunkMiddleware(ctx, 'type', next);
            });

            it('should have called checkFileExists', () => {
                expect(ctx.checkFileExists).toHaveBeenCalledWith(
                    'chunkname',
                    'currentChunkSize',
                );
            });

            it('should have called saveStreamInFile', () => {
                expect(ctx.saveStreamInFile).toHaveBeenCalledWith(
                    'stream',
                    'chunkname',
                );
            });

            it('should have called getUploadedFileSize', () => {
                expect(ctx.getUploadedFileSize).toHaveBeenCalledWith(
                    'filename',
                    'totalChunks',
                );
            });

            it('should mark the upload as queued', () => {
                expect(ctx.markUploadQueued).toHaveBeenCalledWith('filename');
            });

            it('should add job to the queue', () => {
                expect(workerQueue?.add).toHaveBeenCalledWith(
                    IMPORT,
                    {
                        extension: 'extension',
                        filename: 'filename',
                        jobType: IMPORT,
                        loaderName: 'type',
                        totalChunks: 'totalChunks',
                        customLoader: undefined,
                        tenant: 'lodex_test',
                    },
                    { jobId: 'uuid' },
                );
            });
        });

        describe('when chunk do not already exists and all chunk are not present', () => {
            const ctx = {
                tenant: 'lodex_test',
                isUploadCancelled: jest.fn(async () => false),
                markUploadQueued: jest.fn(),
                claimUploadImport: jest.fn(async () => true),
                getUploadedFileSize: jest.fn(() => false),
                checkFileExists: jest.fn().mockImplementation(() => false),
                saveStreamInFile: jest.fn(),
                resumable: {
                    chunkname: 'chunkname',
                    filename: 'filename',
                    totalChunks: 'totalChunks',
                    totalSize: 'totalSize',
                    currentChunkSize: 'currentChunkSize',
                    stream: 'stream',
                },
            };

            const next = jest.fn();

            beforeEach(async () => {
                // @ts-expect-error TS(2554): Expected 2 arguments, but got 3.
                await uploadChunkMiddleware(ctx, 'type', next);
            });

            it('should have called checkFileExists', () => {
                expect(ctx.checkFileExists).toHaveBeenCalledWith(
                    'chunkname',
                    'currentChunkSize',
                );
            });

            it('should have called saveStreamInFile', () => {
                expect(ctx.saveStreamInFile).toHaveBeenCalledWith(
                    'stream',
                    'chunkname',
                );
            });

            it('should have called getUploadedFileSize', () => {
                expect(ctx.getUploadedFileSize).toHaveBeenCalledWith(
                    'filename',
                    'totalChunks',
                );
            });

            it('should not have called next', () => {
                expect(next).not.toHaveBeenCalled();
            });

            it('should have set ctx.status to 200', () => {
                // @ts-expect-error TS(2304): Cannot find name 'expect'.
                expect(ctx.status).toBe(200);
            });

            it('should not add job to the queue', () => {
                expect(workerQueue?.add).toHaveBeenCalledTimes(0);
            });
        });
    });

    describe('uploadChunkMiddleware of an upload completed twice', () => {
        it('does not queue a second import when another request claimed it', async () => {
            const ctx: any = {
                tenant: 'lodex_test',
                isUploadCancelled: jest.fn(async () => false),
                claimUploadImport: jest.fn(async () => false),
                markUploadQueued: jest.fn(),
                removeUploadChunks: jest.fn(),
                getUploadedFileSize: jest.fn(() => 10),
                checkFileExists: jest.fn(() => false),
                saveStreamInFile: jest.fn(),
                resumable: {
                    extension: 'extension',
                    chunkname: 'chunkname',
                    filename: 'filename',
                    totalChunks: 1,
                    totalSize: 10,
                    currentChunkSize: 10,
                    stream: 'stream',
                },
            };
            await uploadChunkMiddleware(ctx, 'type');
            expect(ctx.claimUploadImport).toHaveBeenCalledWith('filename');
            expect(ctx.status).toBe(200);
            expect(ctx.body).toEqual({ status: 'pending' });
            expect(ctx.markUploadQueued).not.toHaveBeenCalled();
            expect(ctx.removeUploadChunks).not.toHaveBeenCalled();
            expect(getOrCreateWorkerQueue).not.toHaveBeenCalled();
        });
    });

    describe('uploadChunkMiddleware of a cancelled upload', () => {
        const makeCtx = (isCancelled: jest.Mock) => ({
            tenant: 'lodex_test',
            isUploadCancelled: isCancelled,
            markUploadQueued: jest.fn(),
            claimUploadImport: jest.fn(async () => true),
            removeUploadChunks: jest.fn(),
            getUploadedFileSize: jest.fn(() => 10),
            checkFileExists: jest.fn(() => false),
            saveStreamInFile: jest.fn(),
            resumable: {
                extension: 'extension',
                chunkname: 'chunkname',
                filename: 'filename',
                totalChunks: 1,
                totalSize: 10,
                currentChunkSize: 10,
                stream: 'stream',
            },
        });

        it('cleans up the old uploads when a new one starts', async () => {
            const ctx: any = {
                ...makeCtx(jest.fn(async () => false)),
                removeStaleUploadFiles: jest.fn(),
            };
            ctx.resumable.chunkNumber = 1;
            ctx.resumable.filename = '/uploads/lodex_test_id';
            await uploadChunkMiddleware(ctx, 'type');
            expect(ctx.removeStaleUploadFiles).toHaveBeenCalledWith(
                '/uploads',
                'lodex_test',
            );
        });

        it('refuses a chunk of an upload already cancelled', async () => {
            const ctx: any = makeCtx(jest.fn(async () => true));
            await uploadChunkMiddleware(ctx, 'type');
            expect(ctx.status).toBe(409);
            expect(ctx.saveStreamInFile).not.toHaveBeenCalled();
            expect(workerQueue?.add).not.toHaveBeenCalled();
        });

        it('drops the chunks and never queues the import when cancelled meanwhile', async () => {
            // not cancelled when the chunk arrives, cancelled once it is saved
            const ctx: any = makeCtx(
                jest
                    .fn()
                    .mockResolvedValueOnce(false)
                    .mockResolvedValueOnce(true),
            );
            await uploadChunkMiddleware(ctx, 'type');
            expect(ctx.saveStreamInFile).toHaveBeenCalled();
            expect(ctx.removeUploadChunks).toHaveBeenCalledWith('filename');
            expect(workerQueue?.add).not.toHaveBeenCalled();
            expect(ctx.status).toBe(409);
            // the progress started by this chunk is not left on uploading
            expect(progress.getStatus('lodex_test')).not.toBe(
                ProgressStatus.UPLOADING_DATASET,
            );
        });
    });

    describe('cancelUpload', () => {
        const makeCtx = (identifier: unknown) => ({
            tenant: 'lodex_test',
            request: { body: { identifier } },
            markUploadCancelled: jest.fn(),
            isUploadQueued: jest.fn(async () => false),
            removeUploadChunks: jest.fn(),
        });

        it('marks the upload as cancelled, drops its chunks and its progress', async () => {
            progress.start('lodex_test', {
                status: ProgressStatus.UPLOADING_DATASET,
                target: 100,
                symbol: '%',
                type: IMPORT,
            });
            const ctx: any = makeCtx('10-datacsv-123');
            await cancelUpload(ctx);
            const filename = expect.stringMatching(
                /lodex_test_10-datacsv-123$/,
            );
            expect(ctx.markUploadCancelled).toHaveBeenCalledWith(filename);
            expect(ctx.removeUploadChunks).toHaveBeenCalledWith(filename);
            expect(progress.getStatus('lodex_test')).toBe(
                ProgressStatus.PENDING,
            );
            expect(ctx.body).toEqual({ status: 'cancelled' });
        });

        it('keeps the chunks of an upload whose import was queued', async () => {
            const ctx: any = makeCtx('10-datacsv-123');
            ctx.isUploadQueued.mockResolvedValue(true);
            await cancelUpload(ctx);
            expect(ctx.markUploadCancelled).toHaveBeenCalled();
            expect(ctx.removeUploadChunks).not.toHaveBeenCalled();
            expect(ctx.body).toEqual({ status: 'import_started' });
        });

        it.each([[undefined], ['../../etc/passwd'], ['a/b'], [42]])(
            'refuses the identifier %p',
            async (identifier) => {
                const ctx: any = makeCtx(identifier);
                await cancelUpload(ctx);
                expect(ctx.status).toBe(400);
                expect(ctx.markUploadCancelled).not.toHaveBeenCalled();
            },
        );
    });

    describe('uploadUrl', () => {
        const ctx = {
            tenant: 'lodex_test',
            request: {
                body: {
                    url: 'http://host/file.name.ext',
                    loaderName: 'type',
                },
            },
        };

        beforeEach(async () => {
            await uploadUrl(ctx);
        });

        it('should add job to the queue', () => {
            expect(workerQueue?.add).toHaveBeenCalledWith(
                IMPORT,
                {
                    extension: 'ext',
                    url: 'http://host/file.name.ext',
                    jobType: IMPORT,
                    loaderName: 'type',
                    customLoader: undefined,
                    tenant: 'lodex_test',
                },
                { jobId: 'uuid' },
            );
        });
    });

    describe('uploadUrl with customLoader', () => {
        const ctx = {
            tenant: 'lodex_test',
            request: {
                body: {
                    url: 'http://host/file.name.ext',
                    customLoader: 'customLoader',
                },
            },
        };

        beforeEach(async () => {
            await uploadUrl(ctx);
        });

        it('should add job to the queue', () => {
            expect(workerQueue?.add).toHaveBeenCalledWith(
                IMPORT,
                {
                    extension: 'ext',
                    url: 'http://host/file.name.ext',
                    jobType: IMPORT,
                    customLoader: 'customLoader',
                    loaderName: undefined,
                    tenant: 'lodex_test',
                },
                { jobId: 'uuid' },
            );
        });
    });

    describe('uploadText', () => {
        const ctx: Record<string, unknown> = {
            tenant: 'lodex_test',
            request: {
                body: {
                    text: 'authorships.institutions.lineage:i4210144781',
                    loaderName: 'query-openalex-for-model',
                },
            },
        };

        beforeEach(async () => {
            await uploadText(ctx);
        });

        it('should add job to the queue', () => {
            expect(workerQueue?.add).toHaveBeenCalledWith(
                IMPORT,
                {
                    text: 'authorships.institutions.lineage:i4210144781',
                    jobType: IMPORT,
                    loaderName: 'query-openalex-for-model',
                    customLoader: undefined,
                    tenant: 'lodex_test',
                },
                { jobId: 'uuid' },
            );
        });

        // without a body, Koa answers 404 although the job is queued
        it('should answer that the import is pending', () => {
            expect(ctx.body).toStrictEqual({ status: 'pending' });
        });
    });
});

describe('upload with site generation', () => {
    let add: jest.Mock;
    beforeEach(() => {
        add = jest.fn();
        jest.mocked(getOrCreateWorkerQueue).mockReturnValue({
            add,
        } as unknown as Queue);
        jest.mocked(startWizardGeneration).mockReset();
        jest.mocked(failWizardGeneration).mockClear();
        jest.mocked(startDataAddGeneration).mockReset();
    });

    const choice = { modelId: 'm', siteName: 'Site' };

    it('uploadUrl starts the generation and queues the job with its run id', async () => {
        jest.mocked(startWizardGeneration).mockResolvedValue({
            runId: 'run-1',
        } as any);
        const ctx: any = {
            tenant: 'lodex_test',
            request: {
                body: {
                    url: 'http://host/file.csv',
                    loaderName: 'csv',
                    siteGeneration: choice,
                },
            },
        };
        await uploadUrl(ctx);
        expect(startWizardGeneration).toHaveBeenCalledWith(ctx, choice, 'uuid');
        expect(add).toHaveBeenCalledWith(
            IMPORT,
            expect.objectContaining({
                siteGenerationRunId: 'run-1',
                url: 'http://host/file.csv',
            }),
            { jobId: 'uuid' },
        );
        expect(ctx.body).toEqual({ status: 'pending' });
    });

    it('uploadUrl queues nothing when the choice is refused', async () => {
        jest.mocked(startWizardGeneration).mockResolvedValue({
            status: 404,
            error: 'model_not_found',
        });
        const ctx: any = {
            tenant: 'lodex_test',
            request: {
                body: {
                    url: 'http://host/file.csv',
                    siteGeneration: choice,
                },
            },
        };
        await uploadUrl(ctx);
        expect(add).not.toHaveBeenCalled();
        expect(ctx.status).toBe(404);
        expect(ctx.body).toEqual({ error: 'model_not_found' });
    });

    it('uploadUrl keeps only the text fields of the choice', async () => {
        jest.mocked(startWizardGeneration).mockResolvedValue({
            runId: 'run-1',
        } as any);
        const ctx: any = {
            tenant: 'lodex_test',
            request: {
                body: {
                    url: 'http://host/file.csv',
                    siteGeneration: {
                        modelId: 'm',
                        siteName: 'Site',
                        siteDescription: { $ne: null },
                        theme: 3,
                        status: 'done',
                    },
                },
            },
        };
        await uploadUrl(ctx);
        expect(startWizardGeneration).toHaveBeenCalledWith(
            ctx,
            { modelId: 'm', siteName: 'Site' },
            'uuid',
        );
    });

    it.each([
        ['an object', { $ne: null }],
        ['a number', 3],
        ['missing', undefined],
    ])(
        'uploadText refuses a model id that is %s as an unknown model',
        async (_name, modelId) => {
            const ctx: any = {
                tenant: 'lodex_test',
                request: {
                    body: { text: 'q', siteGeneration: { modelId } },
                },
            };
            await uploadText(ctx);
            expect(startWizardGeneration).not.toHaveBeenCalled();
            expect(add).not.toHaveBeenCalled();
            expect(ctx.status).toBe(404);
            expect(ctx.body).toEqual({ error: 'model_not_found' });
        },
    );

    it('uploadUrl without siteGeneration queues the job as before', async () => {
        const ctx: any = {
            tenant: 'lodex_test',
            request: { body: { url: 'http://host/file.csv' } },
        };
        await uploadUrl(ctx);
        expect(startWizardGeneration).not.toHaveBeenCalled();
        expect(add.mock.calls[0][1]).not.toHaveProperty('siteGenerationRunId');
    });

    it('uploadText starts the generation and queues the job with its run id', async () => {
        jest.mocked(startWizardGeneration).mockResolvedValue({
            runId: 'run-1',
        } as any);
        const ctx: any = {
            tenant: 'lodex_test',
            request: {
                body: { text: 'q', loaderName: 'l', siteGeneration: choice },
            },
        };
        await uploadText(ctx);
        expect(startWizardGeneration).toHaveBeenCalledWith(ctx, choice, 'uuid');
        expect(add).toHaveBeenCalledWith(
            IMPORT,
            expect.objectContaining({ siteGenerationRunId: 'run-1' }),
            { jobId: 'uuid' },
        );
    });

    it('uploadText queues nothing when the choice is refused', async () => {
        jest.mocked(startWizardGeneration).mockResolvedValue({
            status: 400,
            error: 'model_archive_not_tar',
        });
        const ctx: any = {
            tenant: 'lodex_test',
            request: { body: { text: 'q', siteGeneration: choice } },
        };
        await uploadText(ctx);
        expect(add).not.toHaveBeenCalled();
        expect(ctx.status).toBe(400);
    });

    describe('data add', () => {
        const dataAdd = { relaunch: true, autoPublish: false };

        it('uploadText starts a data add and queues the job with its run id', async () => {
            jest.mocked(startDataAddGeneration).mockResolvedValue({
                runId: 'run-2',
            });
            const ctx: any = {
                tenant: 'lodex_test',
                request: { body: { text: 'q', loaderName: 'csv', dataAdd } },
            };
            await uploadText(ctx);
            expect(startDataAddGeneration).toHaveBeenCalledWith(
                ctx,
                dataAdd,
                'csv',
                'uuid',
            );
            expect(add).toHaveBeenCalledWith(
                IMPORT,
                expect.objectContaining({
                    siteGenerationRunId: 'run-2',
                    keepDatasetOnCancel: true,
                }),
                { jobId: 'uuid' },
            );
        });

        it('uploadText reads the flags as booleans', async () => {
            jest.mocked(startDataAddGeneration).mockResolvedValue({
                runId: 'run-2',
            });
            const ctx: any = {
                tenant: 'lodex_test',
                request: {
                    body: {
                        text: 'q',
                        loaderName: 'csv',
                        dataAdd: { relaunch: 'true', autoPublish: 'nope' },
                    },
                },
            };
            await uploadText(ctx);
            expect(startDataAddGeneration).toHaveBeenCalledWith(
                ctx,
                { relaunch: true, autoPublish: false },
                'csv',
                'uuid',
            );
        });

        it('uploadText queues nothing when the data add is refused', async () => {
            jest.mocked(startDataAddGeneration).mockResolvedValue({
                status: 409,
                error: 'not_simplified',
            });
            const ctx: any = {
                tenant: 'lodex_test',
                request: { body: { text: 'q', loaderName: 'csv', dataAdd } },
            };
            await uploadText(ctx);
            expect(add).not.toHaveBeenCalled();
            expect(ctx.status).toBe(409);
            expect(ctx.body).toEqual({ error: 'not_simplified' });
        });

        it('uploadText without dataAdd nor siteGeneration is a manual import', async () => {
            const ctx: any = {
                tenant: 'lodex_test',
                request: { body: { text: 'q', loaderName: 'csv' } },
            };
            await uploadText(ctx);
            expect(startDataAddGeneration).not.toHaveBeenCalled();
            expect(add.mock.calls[0][1]).not.toHaveProperty(
                'siteGenerationRunId',
            );
            expect(add.mock.calls[0][1]).not.toHaveProperty(
                'keepDatasetOnCancel',
            );
        });

        it('a failing queue puts the data add in error', async () => {
            jest.mocked(startDataAddGeneration).mockResolvedValue({
                runId: 'run-2',
            });
            add.mockRejectedValue(new Error('redis down'));
            const ctx: any = {
                tenant: 'lodex_test',
                request: { body: { text: 'q', loaderName: 'csv', dataAdd } },
            };
            await expect(uploadText(ctx)).rejects.toThrow('redis down');
            expect(failWizardGeneration).toHaveBeenCalledWith(
                ctx,
                'run-2',
                'redis down',
            );
        });

        describe('last chunk', () => {
            const makeCtx = () =>
                ({
                    tenant: 'lodex_test',
                    resumable: {
                        chunkname: 'c',
                        currentChunkSize: 5,
                        stream: 's',
                        filename: 'f',
                        totalChunks: 2,
                        totalSize: 10,
                        extension: 'csv',
                        customLoader: null,
                        chunkNumber: 2,
                        dataAdd,
                    },
                    isUploadCancelled: jest.fn().mockResolvedValue(false),
                    removeStaleUploadFiles: jest.fn(),
                    checkFileExists: jest.fn().mockResolvedValue(true),
                    saveStreamInFile: jest.fn(),
                    getUploadedFileSize: jest.fn().mockResolvedValue(10),
                    claimUploadImport: jest.fn(async () => true),
                    markUploadQueued: jest.fn(),
                    removeUploadChunks: jest.fn(),
                }) as any;

            it('starts the data add then queues the job', async () => {
                jest.mocked(startDataAddGeneration).mockResolvedValue({
                    runId: 'run-2',
                });
                const ctx = makeCtx();
                await uploadChunkMiddleware(ctx, 'csv');
                expect(startDataAddGeneration).toHaveBeenCalledWith(
                    ctx,
                    dataAdd,
                    'csv',
                    'uuid',
                );
                expect(add).toHaveBeenCalledWith(
                    IMPORT,
                    expect.objectContaining({
                        siteGenerationRunId: 'run-2',
                        keepDatasetOnCancel: true,
                    }),
                    { jobId: 'uuid' },
                );
            });

            it('hands the multipart fields to the data add as booleans', async () => {
                jest.mocked(startDataAddGeneration).mockResolvedValue({
                    runId: 'run-2',
                });
                const ctx: any = {
                    ...makeCtx(),
                    req: 'req',
                    requestToStream: jest.fn().mockResolvedValue({
                        stream: 's',
                        fields: {
                            resumableChunkNumber: '2',
                            resumableIdentifier: 'identifier',
                            resumableTotalChunks: '2',
                            resumableTotalSize: '10',
                            resumableCurrentChunkSize: '5',
                            resumableFilename: 'data.csv',
                            dataAdd: 'true',
                            relaunch: 'true',
                            autoPublish: 'false',
                        },
                    }),
                };
                await parseRequest(ctx, null, jest.fn());
                await uploadChunkMiddleware(ctx, 'csv');
                expect(startDataAddGeneration).toHaveBeenCalledWith(
                    ctx,
                    { relaunch: true, autoPublish: false },
                    'csv',
                    'uuid',
                );
            });

            it('a refusal drops the chunks and queues nothing', async () => {
                jest.mocked(startDataAddGeneration).mockResolvedValue({
                    status: 409,
                    error: 'site_generation_in_progress',
                });
                const ctx = makeCtx();
                await uploadChunkMiddleware(ctx, 'csv');
                expect(add).not.toHaveBeenCalled();
                expect(ctx.removeUploadChunks).toHaveBeenCalledWith('f');
                expect(ctx.status).toBe(409);
                expect(ctx.body).toEqual({
                    error: 'site_generation_in_progress',
                });
            });
        });
    });

    describe('last chunk', () => {
        const makeCtx = (chunkNumber: number, uploaded: number) =>
            ({
                tenant: 'lodex_test',
                resumable: {
                    chunkname: 'c',
                    currentChunkSize: 5,
                    stream: 's',
                    filename: 'f',
                    totalChunks: 2,
                    totalSize: 10,
                    extension: 'csv',
                    customLoader: null,
                    chunkNumber,
                    choice: { modelId: 'm', siteName: 'Site' },
                },
                isUploadCancelled: jest.fn().mockResolvedValue(false),
                removeStaleUploadFiles: jest.fn(),
                checkFileExists: jest.fn().mockResolvedValue(true),
                saveStreamInFile: jest.fn(),
                getUploadedFileSize: jest.fn().mockResolvedValue(uploaded),
                markUploadQueued: jest.fn(),
                claimUploadImport: jest.fn(async () => true),
                removeUploadChunks: jest.fn(),
            }) as any;

        it('an intermediate chunk starts nothing', async () => {
            const ctx = makeCtx(1, 5);
            await uploadChunkMiddleware(ctx, 'csv');
            expect(startWizardGeneration).not.toHaveBeenCalled();
            expect(add).not.toHaveBeenCalled();
        });

        it('the last chunk starts the generation then queues the job', async () => {
            jest.mocked(startWizardGeneration).mockResolvedValue({
                runId: 'run-1',
            } as any);
            const ctx = makeCtx(2, 10);
            await uploadChunkMiddleware(ctx, 'csv');
            expect(startWizardGeneration).toHaveBeenCalledWith(
                ctx,
                { modelId: 'm', siteName: 'Site' },
                'uuid',
            );
            expect(add).toHaveBeenCalledWith(
                IMPORT,
                expect.objectContaining({ siteGenerationRunId: 'run-1' }),
                { jobId: 'uuid' },
            );
        });

        it('the last chunk keeps only the text fields of the choice', async () => {
            jest.mocked(startWizardGeneration).mockResolvedValue({
                runId: 'run-1',
            } as any);
            const ctx = makeCtx(2, 10);
            // a repeated multipart field comes as an array
            ctx.resumable.choice = { modelId: 'm', theme: ['a', 'b'] };
            await uploadChunkMiddleware(ctx, 'csv');
            expect(startWizardGeneration).toHaveBeenCalledWith(
                ctx,
                { modelId: 'm' },
                'uuid',
            );
        });

        it('the last chunk refuses a model id that is not a text', async () => {
            const ctx = makeCtx(2, 10);
            ctx.resumable.choice = { modelId: ['a', 'b'] };
            await uploadChunkMiddleware(ctx, 'csv');
            expect(startWizardGeneration).not.toHaveBeenCalled();
            expect(ctx.removeUploadChunks).toHaveBeenCalledWith('f');
            expect(add).not.toHaveBeenCalled();
            expect(ctx.status).toBe(404);
            expect(ctx.body).toEqual({ error: 'model_not_found' });
        });

        it('a refused choice removes the chunks and queues nothing', async () => {
            jest.mocked(startWizardGeneration).mockResolvedValue({
                status: 404,
                error: 'model_not_found',
            });
            const ctx = makeCtx(2, 10);
            await uploadChunkMiddleware(ctx, 'csv');
            expect(ctx.markUploadQueued).not.toHaveBeenCalled();
            expect(ctx.removeUploadChunks).toHaveBeenCalledWith('f');
            expect(add).not.toHaveBeenCalled();
            expect(ctx.status).toBe(404);
            expect(ctx.body).toEqual({ error: 'model_not_found' });
        });

        describe('when queueing the import fails', () => {
            beforeEach(() => {
                jest.mocked(startWizardGeneration).mockResolvedValue({
                    runId: 'run-1',
                } as any);
                add.mockRejectedValue(new Error('redis down'));
            });

            it('uploadUrl fails the generation and rethrows', async () => {
                const ctx: any = {
                    tenant: 'lodex_test',
                    request: {
                        body: {
                            url: 'http://host/f.csv',
                            siteGeneration: choice,
                        },
                    },
                };
                await expect(uploadUrl(ctx)).rejects.toThrow('redis down');
                expect(failWizardGeneration).toHaveBeenCalledWith(
                    ctx,
                    'run-1',
                    'redis down',
                );
            });

            it('uploadText fails the generation and rethrows', async () => {
                const ctx: any = {
                    tenant: 'lodex_test',
                    request: { body: { text: 'q', siteGeneration: choice } },
                };
                await expect(uploadText(ctx)).rejects.toThrow('redis down');
                expect(failWizardGeneration).toHaveBeenCalledWith(
                    ctx,
                    'run-1',
                    'redis down',
                );
            });

            it('without a generation, nothing is failed', async () => {
                const ctx: any = {
                    tenant: 'lodex_test',
                    request: { body: { text: 'q' } },
                };
                await expect(uploadText(ctx)).rejects.toThrow('redis down');
                expect(failWizardGeneration).not.toHaveBeenCalled();
            });

            it('the last chunk fails the generation and removes the chunks', async () => {
                const ctx = makeCtx(2, 10);
                await expect(uploadChunkMiddleware(ctx, 'csv')).rejects.toThrow(
                    'redis down',
                );
                expect(failWizardGeneration).toHaveBeenCalledWith(
                    ctx,
                    'run-1',
                    'redis down',
                );
                expect(ctx.removeUploadChunks).toHaveBeenCalledWith('f');
            });
        });

        it('the last chunk removes the chunks and answers when the start throws', async () => {
            jest.mocked(startWizardGeneration).mockRejectedValue(
                new Error('mongo down'),
            );
            const ctx = makeCtx(2, 10);
            await uploadChunkMiddleware(ctx, 'csv');
            expect(ctx.removeUploadChunks).toHaveBeenCalledWith('f');
            expect(ctx.markUploadQueued).not.toHaveBeenCalled();
            expect(add).not.toHaveBeenCalled();
            expect(ctx.status).toBe(500);
            expect(ctx.body).toEqual({ error: 'mongo down' });
        });
    });
});
