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

    describe('uploadChunkMiddleware', () => {
        describe('when chunk already exists but not all chunk are present', () => {
            const ctx = {
                tenant: 'lodex_test',
                isUploadCancelled: jest.fn(async () => false),
                markUploadQueued: jest.fn(),
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

    describe('uploadChunkMiddleware of a cancelled upload', () => {
        const makeCtx = (isCancelled: jest.Mock) => ({
            tenant: 'lodex_test',
            isUploadCancelled: isCancelled,
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
