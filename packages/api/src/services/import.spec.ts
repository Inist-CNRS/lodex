// @ts-expect-error TS(2792): Cannot find module 'fetch-with-proxy'.
import fetch from 'fetch-with-proxy';
import { PassThrough, Readable } from 'stream';
import { getStreamFromUrl, startImport } from './import';
import progress from './progress';
jest.mock('fetch-with-proxy', () => jest.fn());
jest.mock('@ezs/core/fusible', () => ({
    createFusible: jest.fn(async () => 'fusible'),
    enableFusible: jest.fn(),
    disableFusible: jest.fn(),
    watchFusible: jest.fn(async () => () => {}),
    checkFusible: jest.fn(async () => true),
}));
import { checkFusible } from '@ezs/core/fusible';
import {
    isUploadCancelled,
    removeUploadChunks,
    removeUploadQueuedMarker,
} from './uploadCancellation';
jest.mock('./uploadCancellation', () => ({
    isUploadCancelled: jest.fn(async () => false),
    removeUploadChunks: jest.fn(),
    removeUploadQueuedMarker: jest.fn(),
}));
jest.mock('./progress', () => ({
    start: jest.fn(),
    finish: jest.fn(),
    getStatus: jest.fn(() => 'UPLOADING_DATASET'),
    status: 'PENDING',
}));
describe('startImport of a cancelled upload', () => {
    it('reports a cancel and drops the chunks without importing', async () => {
        (isUploadCancelled as jest.Mock).mockResolvedValueOnce(true);
        const ctx = {
            tenant: 'lodex',
            job: {
                data: { filename: 'upload/lodex_id', totalChunks: 3 },
                update: jest.fn(),
            },
            mergeChunks: jest.fn(),
            saveParsedStream: jest.fn(),
        };
        await expect(startImport(ctx)).rejects.toThrow('cancelled_import');
        expect(removeUploadChunks).toHaveBeenCalledWith('upload/lodex_id');
        expect(removeUploadQueuedMarker).toHaveBeenCalledWith(
            'upload/lodex_id',
        );
        expect(ctx.mergeChunks).not.toHaveBeenCalled();
        expect(ctx.saveParsedStream).not.toHaveBeenCalled();
        // the progress no longer shows the end of the upload
        expect(progress.finish).toHaveBeenCalledWith('lodex');
    });
});

describe('startImport of a failing import', () => {
    it('keeps the error of the import, to explain it', async () => {
        const error = Object.assign(new Error('Bad Request'), {
            status: 400,
        });
        const ctx = {
            tenant: 'lodex',
            job: { data: { text: 'query' }, update: jest.fn() },
            getLoader: jest.fn(() => (stream: any) => stream),
            getStreamFromText: jest.fn(() => ({
                pipe: () => ({
                    pipe: () => ({ pipe: () => ({ pipe: () => ({}) }) }),
                }),
            })),
            saveParsedStream: jest.fn().mockRejectedValue(error),
        };
        await expect(startImport(ctx)).rejects.toMatchObject({
            message: 'Error during import: Error: Bad Request',
            cause: error,
        });
    });
});

describe('startImport of a loader', () => {
    const importLines = (lines: object[]) =>
        startImport({
            tenant: 'lodex',
            job: { data: { text: 'query' }, update: jest.fn() },
            getLoader: jest.fn(() => () => Readable.from(lines)),
            getStreamFromText: jest.fn(() => Readable.from(['query'])),
            saveParsedStream: jest.fn(
                (_ctx: any, stream: any) =>
                    new Promise((resolve, reject) => {
                        stream
                            .on('data', () => {})
                            .on('end', resolve)
                            .on('error', reject);
                    }),
            ),
            dataset: { indexColumns: jest.fn() },
        });

    it('fails when it reads no line: it may not suit the data', async () => {
        await expect(importLines([])).rejects.toMatchObject({
            cause: { code: 'import_error_no_line' },
        });
    });

    it('succeeds when it reads a line', async () => {
        await expect(importLines([{ uri: 'uid:/1' }])).resolves.toBe(undefined);
    });

    it('does not blame the loader when the import was cancelled', async () => {
        // cancelJob disabled the fusible: the breakers cut the stream
        (checkFusible as jest.Mock).mockResolvedValue(false);
        try {
            await expect(importLines([])).resolves.toBe(undefined);
        } finally {
            (checkFusible as jest.Mock).mockResolvedValue(true);
        }
    });
});

describe('getStreamFromUrl', () => {
    // a node-fetch answer of a failed url
    const failWith = (body: NodeJS.ReadableStream) =>
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 503,
            statusText: 'Service Unavailable',
            body,
        });

    afterEach(() => jest.useRealTimers());

    it('fails with the status and the answer of the url', async () => {
        failWith(Readable.from(['Maintenance ', 'en cours']));
        await expect(
            getStreamFromUrl('http://example.org'),
        ).rejects.toMatchObject({
            message: 'Service Unavailable',
            status: 503,
            responseText: 'Maintenance en cours',
        });
    });

    it('keeps only the start of a long answer', async () => {
        failWith(Readable.from(['x'.repeat(50_000)]));
        await expect(
            getStreamFromUrl('http://example.org'),
        ).rejects.toMatchObject({
            responseText: 'x'.repeat(10_000),
        });
    });

    it('keeps the status when the answer is cut off', async () => {
        const body = new PassThrough();
        failWith(body);
        body.write('Mainten');
        setImmediate(() => body.destroy(new Error('socket hang up')));
        await expect(
            getStreamFromUrl('http://example.org'),
        ).rejects.toMatchObject({ status: 503, responseText: 'Mainten' });
    });

    it('does not wait for an answer that never ends', async () => {
        jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] });
        const body = new PassThrough();
        failWith(body);
        body.write('Mainten');
        const failure = expect(
            getStreamFromUrl('http://example.org'),
        ).rejects.toMatchObject({ status: 503, responseText: 'Mainten' });
        await jest.advanceTimersByTimeAsync(5_000);
        await failure;
    });
});

describe.skip('import', () => {
    describe('startImport with file and automatic loader', () => {
        const stream = {
            pipe: jest.fn(),
        };
        const loader = jest.fn().mockImplementation(() => stream);
        const ctx = {
            tenant: 'lodex',
            job: {
                data: {
                    loaderName: 'automatic',
                    filename: 'upload/filename.csv',
                    totalChunks: 3,
                    extension: 'csv',
                    customLoader: null,
                },
                update: jest.fn(),
            },
            getLoader: jest.fn().mockImplementation(() => loader),
            mergeChunks: jest.fn().mockImplementation(() => stream),
            clearChunks: jest.fn(),
            saveParsedStream: jest.fn(),
            dataset: {
                indexColumns: jest.fn(),
            },
        };
        beforeAll(async () => {
            await startImport(ctx);
        });

        it('should have started progress', async () => {
            expect(progress.start).toHaveBeenCalledWith('lodex', {
                status: 'SAVING_DATASET',
                subLabel: 'imported_lines',
                type: 'import',
            });
        });

        it('should have called getLoader with extension', async () => {
            expect(ctx.getLoader).toHaveBeenCalledWith('csv', {
                parser: 'csv',
                source: 'upload/filename.csv',
            });
        });

        it('should have called mergeChunks', async () => {
            expect(ctx.mergeChunks).toHaveBeenCalledWith(
                'upload/filename.csv',
                3,
            );
        });

        it('should have called loader with stream', () => {
            expect(loader).toHaveBeenCalledWith('stream');
        });

        it('should have called saveParsedStream with parsedStream', () => {
            expect(ctx.saveParsedStream).toHaveBeenCalledWith(
                ctx,
                'parsedStream',
            );
        });

        it('should have started indexation progress', () => {
            expect(progress.start).toHaveBeenCalledWith('lodex', {
                status: 'INDEXATION',
                type: 'import',
            });
        });

        it('should have called indexColumns', () => {
            expect(ctx.dataset.indexColumns).toHaveBeenCalled();
        });

        it('should have finished progress', () => {
            expect(progress.finish).toHaveBeenCalled();
        });

        it('should have called clearChunks', () => {
            expect(ctx.clearChunks).toHaveBeenCalledWith(
                'upload/filename.csv',
                3,
            );
        });
    });

    describe('startImport with file and custom loader', () => {
        const stream = {
            pipe: jest.fn(),
        };
        const loader = jest.fn().mockImplementation(() => stream);
        const ctx = {
            job: {
                data: {
                    loaderName: 'automatic',
                    filename: 'upload/filename.csv',
                    totalChunks: 3,
                    extension: 'csv',
                    customLoader: 'custom',
                },
                update: jest.fn(),
            },
            getCustomLoader: () => loader,
            getStreamFromUrl: jest.fn().mockImplementation(() => stream),
            getStreamFromText: jest.fn().mockImplementation(() => stream),
            mergeChunks: jest.fn().mockImplementation(() => stream),
            clearChunks: jest.fn(),
            saveParsedStream: jest.fn(),
            dataset: {
                indexColumns: jest.fn(),
            },
        };
        beforeAll(async () => {
            await startImport(ctx);
        });

        it('should have started progress', async () => {
            expect(progress.start).toHaveBeenCalledWith('lodex', {
                status: 'SAVING_DATASET',
                subLabel: 'imported_lines',
                type: 'import',
            });
        });

        it('should have called getCustomLoader with custom', async () => {
            expect(ctx.getCustomLoader).toHaveBeenCalledWith('custom', {
                parser: 'csv/custom',
                source: 'upload/filename.csv',
            });
        });

        it('should have called mergeChunks', async () => {
            expect(ctx.mergeChunks).toHaveBeenCalledWith(
                'upload/filename.csv',
                3,
            );
        });

        it('should have called loader with stream', () => {
            expect(loader).toHaveBeenCalledWith('stream');
        });

        it('should have called saveParsedStream with parsedStream', () => {
            expect(ctx.saveParsedStream).toHaveBeenCalledWith(
                ctx,
                'parsedStream',
            );
        });

        it('should have started indexation progress', () => {
            expect(progress.start).toHaveBeenCalledWith('lodex', {
                status: 'INDEXATION',
                type: 'import',
            });
        });

        it('should have called indexColumns', () => {
            expect(ctx.dataset.indexColumns).toHaveBeenCalled();
        });

        it('should have finished progress', () => {
            expect(progress.finish).toHaveBeenCalled();
        });

        it('should have called clearChunks', () => {
            expect(ctx.clearChunks).toHaveBeenCalledWith(
                'upload/filename.csv',
                3,
            );
        });
    });

    describe('startImport with url and automatic loader', () => {
        const stream = {
            pipe: jest.fn(),
        };
        const loader = jest.fn().mockImplementation(() => stream);
        const ctx = {
            job: {
                data: {
                    loaderName: 'automatic',
                    url: 'http://host/file.name.csv',
                    extension: 'csv',
                    customLoader: null,
                },
                update: jest.fn(),
            },
            getLoader: jest.fn().mockImplementation(() => loader),
            getStreamFromUrl: jest.fn().mockImplementation(() => stream),
            clearChunks: jest.fn(),
            saveParsedStream: jest.fn(),
            dataset: {
                indexColumns: jest.fn(),
            },
        };
        beforeAll(async () => {
            await startImport(ctx);
        });

        it('should have started progress', async () => {
            expect(progress.start).toHaveBeenCalledWith('lodex', {
                status: 'SAVING_DATASET',
                subLabel: 'imported_lines',
                type: 'import',
            });
        });

        it('should have called getLoader with extension', async () => {
            expect(ctx.getLoader).toHaveBeenCalledWith('csv', {
                parser: 'csv',
                source: 'http://host/file.name.csv',
            });
        });

        it('should have called getStreamFromUrl', async () => {
            expect(ctx.getStreamFromUrl).toHaveBeenCalledWith(
                'http://host/file.name.csv',
            );
        });

        it('should have called loader with streamUrl', () => {
            expect(loader).toHaveBeenCalledWith('streamUrl');
        });

        it('should have called saveParsedStream with parsedStream', () => {
            expect(ctx.saveParsedStream).toHaveBeenCalledWith(
                ctx,
                'parsedStream',
            );
        });

        it('should have started indexation progress', () => {
            expect(progress.start).toHaveBeenCalledWith('lodex', {
                status: 'INDEXATION',
                type: 'import',
            });
        });

        it('should have called indexColumns', () => {
            expect(ctx.dataset.indexColumns).toHaveBeenCalled();
        });

        it('should have finished progress', () => {
            expect(progress.finish).toHaveBeenCalled();
        });
    });
});
