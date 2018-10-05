import config from 'config';

import { parseRequest, uploadChunkMiddleware, uploadUrl } from './upload';

describe('upload', () => {
    describe('parseRequest', () => {
        const ctx = {
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
        };
        const next = jest.fn();

        it('should put info from resumable parsed request into ctx.resumable', async () => {
            await parseRequest(ctx, null, next);
            expect(ctx.requestToStream).toHaveBeenCalledWith('req');
            expect(next).toHaveBeenCalled();
            expect(ctx.resumable).toEqual({
                stream: 'stream',
                filename: `${config.uploadDir}/identifier`,
                chunkname: `${config.uploadDir}/identifier.10`,
                totalChunks: 100,
                totalSize: 500,
                currentChunkSize: 5,
                extension: 'csv',
            });
        });
    });

    describe('uploadChunkMiddleware', () => {
        describe('when chunk already exists but not all chunk are present', () => {
            const ctx = {
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
        });

        describe('when chunk already exists and all chunk are present', () => {
            const ctx = {
                getUploadedFileSize: jest.fn(() => 10),
                checkFileExists: jest.fn().mockImplementation(() => true),
                saveStreamInFile: jest.fn(),
                resumable: {
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

            it('should have called next', () => {
                expect(next).toHaveBeenCalled();
            });

            it('should not have set ctx.status to 200', () => {
                expect(ctx.status).toBe(undefined);
            });
        });

        describe('when chunk do not already exists and all chunk become present', () => {
            const ctx = {
                getUploadedFileSize: jest.fn(() => 10),
                checkFileExists: jest.fn().mockImplementation(() => false),
                saveStreamInFile: jest.fn(),
                resumable: {
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

            it('should have called next', () => {
                expect(next).toHaveBeenCalled();
            });

            it('should not have set ctx.status to 200', () => {
                expect(ctx.status).toBe(undefined);
            });
        });

        describe('when chunk do not already exists and all chunk are not present', () => {
            const ctx = {
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
        });
    });

    describe('uploadUrl', () => {
        const parser = jest.fn().mockImplementation(() => 'parsedStream');
        const ctx = {
            request: {
                body: {
                    url: 'http://host/file.name.type',
                },
            },
            getParser: jest.fn().mockImplementation(() => parser),
            getStreamFromUrl: jest.fn().mockImplementation(() => 'streamUrl'),
            saveParsedStream: jest
                .fn()
                .mockImplementation(() => 'dataset count'),
        };

        beforeAll(async () => {
            await uploadUrl(ctx);
        });

        it('should have called getParser with url file extension', () => {
            expect(ctx.getParser).toHaveBeenCalledWith('type');
        });

        it('should have called getStreamForUrl with url', () => {
            expect(ctx.getStreamFromUrl).toHaveBeenCalledWith(
                'http://host/file.name.type',
            );
        });

        it('should have called parser with streamUrl', () => {
            expect(parser).toHaveBeenCalledWith('streamUrl');
        });

        it('should have called saveParsedStream with parsedStream', () => {
            expect(ctx.saveParsedStream).toHaveBeenCalledWith('parsedStream');
        });

        it('should have set ctx.body.totalLines to `dataset count`', () => {
            expect(ctx.body).toEqual({ totalLines: 'dataset count' });
        });
    });
});
