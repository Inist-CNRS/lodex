import { startImport } from './import';
import progress from './progress';
jest.mock('./progress', () => ({
    start: jest.fn(),
    finish: jest.fn(),
    status: 'PENDING',
}));
describe('import', () => {
    describe('startImport with file and automatic loader', () => {
        const loader = jest.fn().mockImplementation(() => 'parsedStream');
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
            },
            getLoader: jest.fn().mockImplementation(() => loader),
            mergeChunks: jest.fn().mockImplementation(() => 'stream'),
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
        const loader = jest.fn().mockImplementation(() => 'parsedStream');
        const ctx = {
            job: {
                data: {
                    loaderName: 'automatic',
                    filename: 'upload/filename.csv',
                    totalChunks: 3,
                    extension: 'csv',
                    customLoader: 'custom',
                },
            },
            getCustomLoader: jest.fn().mockImplementation(() => loader),
            mergeChunks: jest.fn().mockImplementation(() => 'stream'),
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
        const loader = jest.fn().mockImplementation(() => 'parsedStream');
        const ctx = {
            job: {
                data: {
                    loaderName: 'automatic',
                    url: 'http://host/file.name.csv',
                    extension: 'csv',
                    customLoader: null,
                },
            },
            getLoader: jest.fn().mockImplementation(() => loader),
            getStreamFromUrl: jest.fn().mockImplementation(() => 'streamUrl'),
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
