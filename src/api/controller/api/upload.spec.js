import expect, { createSpy } from 'expect';
import config from 'config';

import { parseRequest, uploadChunkMiddleware, uploadUrl } from './upload';

describe('upload', () => {
    describe('parseRequest', () => {
        const ctx = {
            req: 'req',
            requestToStream: createSpy().andReturn({
                stream: 'stream',
                fields: {
                    resumableChunkNumber: '10',
                    resumableIdentifier: 'identifier',
                    resumableTotalChunks: '100',
                    resumableTotalSize: '500',
                    resumableCurrentChunkSize: '5',
                    resumableFilename: 'data.csv',
                },
            }),
        };

        const next = createSpy();

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
                checkFileExists: createSpy().andReturn(true),
                saveStreamInFile: createSpy(),
                areFileChunksComplete: createSpy().andReturn(false),
                resumable: {
                    chunkname: 'chunkname',
                    filename: 'filename',
                    totalChunks: 'totalChunks',
                    totalSize: 'totalSize',
                    currentChunkSize: 'currentChunkSize',
                    stream: 'stream',
                },
            };

            const next = createSpy();

            before(async () => {
                await uploadChunkMiddleware(ctx, 'type', next);
            });

            it('should have called checkFileExists', () => {
                expect(ctx.checkFileExists).toHaveBeenCalledWith(
                    'chunkname',
                    'currentChunkSize',
                );
            });

            it('should not have called saveStreamInFile', () => {
                expect(ctx.saveStreamInFile).toNotHaveBeenCalled();
            });

            it('should have called areFileChunksComplete', () => {
                expect(ctx.areFileChunksComplete).toHaveBeenCalledWith(
                    'filename',
                    'totalChunks',
                    'totalSize',
                );
            });

            it('should not have called next', () => {
                expect(next).toNotHaveBeenCalled();
            });

            it('should have set ctx.status to 200', () => {
                expect(ctx.status).toBe(200);
            });
        });

        describe('when chunk already exists and all chunk are present', () => {
            const ctx = {
                checkFileExists: createSpy().andReturn(true),
                saveStreamInFile: createSpy(),
                areFileChunksComplete: createSpy().andReturn(true),
                resumable: {
                    chunkname: 'chunkname',
                    filename: 'filename',
                    totalChunks: 'totalChunks',
                    totalSize: 'totalSize',
                    currentChunkSize: 'currentChunkSize',
                    stream: 'stream',
                },
            };

            const next = createSpy();

            before(async () => {
                await uploadChunkMiddleware(ctx, 'type', next);
            });

            it('should have called checkFileExists', () => {
                expect(ctx.checkFileExists).toHaveBeenCalledWith(
                    'chunkname',
                    'currentChunkSize',
                );
            });

            it('should not have called saveStreamInFile', () => {
                expect(ctx.saveStreamInFile).toNotHaveBeenCalled();
            });

            it('should have called areFileChunksComplete', () => {
                expect(ctx.areFileChunksComplete).toHaveBeenCalledWith(
                    'filename',
                    'totalChunks',
                    'totalSize',
                );
            });

            it('should not have called next', () => {
                expect(next).toHaveBeenCalled();
            });

            it('should not have set ctx.status to 200', () => {
                expect(ctx.status).toBe(undefined);
            });
        });

        describe('when chunk do not already exists and all chunk become present', () => {
            const ctx = {
                checkFileExists: createSpy().andReturn(false),
                saveStreamInFile: createSpy(),
                areFileChunksComplete: createSpy().andReturn(true),
                resumable: {
                    chunkname: 'chunkname',
                    filename: 'filename',
                    totalChunks: 'totalChunks',
                    totalSize: 'totalSize',
                    currentChunkSize: 'currentChunkSize',
                    stream: 'stream',
                },
            };

            const next = createSpy();

            before(async () => {
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

            it('should have called areFileChunksComplete', () => {
                expect(ctx.areFileChunksComplete).toHaveBeenCalledWith(
                    'filename',
                    'totalChunks',
                    'totalSize',
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
                checkFileExists: createSpy().andReturn(false),
                saveStreamInFile: createSpy(),
                areFileChunksComplete: createSpy().andReturn(false),
                resumable: {
                    chunkname: 'chunkname',
                    filename: 'filename',
                    totalChunks: 'totalChunks',
                    totalSize: 'totalSize',
                    currentChunkSize: 'currentChunkSize',
                    stream: 'stream',
                },
            };

            const next = createSpy();

            before(async () => {
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

            it('should have called areFileChunksComplete', () => {
                expect(ctx.areFileChunksComplete).toHaveBeenCalledWith(
                    'filename',
                    'totalChunks',
                    'totalSize',
                );
            });

            it('should not have called next', () => {
                expect(next).toNotHaveBeenCalled();
            });

            it('should have set ctx.status to 200', () => {
                expect(ctx.status).toBe(200);
            });
        });
    });

    describe('uploadUrl', () => {
        const parser = createSpy().andReturn('parsedStream');
        const ctx = {
            request: {
                body: {
                    url: 'http://host/file.name.type',
                },
            },
            getParser: createSpy().andReturn(parser),
            dataset: {
                remove: createSpy(),
                count: createSpy().andReturn('count'),
            },
            getStreamFromUrl: createSpy().andReturn('streamUrl'),
            saveStream: createSpy(),
        };

        before(async () => {
            await uploadUrl(ctx);
        });

        it('should have called getParser with url file extension', () => {
            expect(ctx.getParser).toHaveBeenCalledWith('type');
        });

        it('should have called dataset.remove', () => {
            expect(ctx.dataset.remove).toHaveBeenCalled();
        });

        it('should have called getStreamForUrl with url', () => {
            expect(ctx.getStreamFromUrl).toHaveBeenCalledWith(
                'http://host/file.name.type',
            );
        });

        it('should have called parser with streamUrl', () => {
            expect(parser).toHaveBeenCalledWith('streamUrl');
        });

        it('should have called saveStream with parsedStream', () => {
            expect(ctx.saveStream).toHaveBeenCalledWith('parsedStream');
        });

        it('should have called dataset.count', () => {
            expect(ctx.dataset.count).toHaveBeenCalled();
        });

        it('should add body.totalLines: count', () => {
            expect(ctx.body).toEqual({
                totalLines: 'count',
            });
        });
    });
});
