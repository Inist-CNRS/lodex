import config from 'config';

import { parseRequest, uploadChunkMiddleware, uploadUrl } from './upload';
import { IMPORT } from '../../workers/import';
import progress from '../../services/progress';
import { workerQueues } from '../../workers';
jest.mock('../../workers', () => ({
    workerQueues: {
        lodex_test: {
            add: jest.fn(),
        },
    },
}));
jest.mock('uuid', () => ({ v1: () => 'uuid' }));

describe('upload', () => {
    beforeAll(async () => {
        progress.initialize('lodex_test');
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
            expect(ctx.resumable).toEqual({
                stream: 'stream',
                filename: `${config.uploadDir}/lodex_test_identifier`,
                chunkname: `${config.uploadDir}/lodex_test_identifier.10`,
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

            beforeAll(async () => {
                workerQueues[ctx.tenant].add.mockClear();
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
                expect(ctx.status).toBe(200);
            });

            it('should not add job to the queue', () => {
                expect(workerQueues[ctx.tenant].add).not.toHaveBeenCalled();
            });
        });

        describe('when chunk already exists and all chunk are present', () => {
            const ctx = {
                tenant: 'lodex_test',
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

            beforeAll(async () => {
                workerQueues[ctx.tenant].add.mockClear();
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

            it('should add job to the queue', () => {
                expect(workerQueues[ctx.tenant].add).toHaveBeenCalledWith(
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

            beforeAll(async () => {
                workerQueues[ctx.tenant].add.mockClear();
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

            it('should add job to the queue', () => {
                expect(workerQueues[ctx.tenant].add).toHaveBeenCalledWith(
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

            beforeAll(async () => {
                workerQueues[ctx.tenant].add.mockClear();
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
                expect(ctx.status).toBe(200);
            });

            it('should not add job to the queue', () => {
                expect(workerQueues[ctx.tenant].add).not.toHaveBeenCalled();
            });
        });
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

        beforeAll(async () => {
            workerQueues[ctx.tenant].add.mockClear();
            await uploadUrl(ctx);
        });

        it('should add job to the queue', () => {
            expect(workerQueues[ctx.tenant].add).toHaveBeenCalledWith(
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

        beforeAll(async () => {
            workerQueues[ctx.tenant].add.mockClear();
            await uploadUrl(ctx);
        });

        it('should add job to the queue', () => {
            expect(workerQueues[ctx.tenant].add).toHaveBeenCalledWith(
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
});
