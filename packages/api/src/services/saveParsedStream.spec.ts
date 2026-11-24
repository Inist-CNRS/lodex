import { saveParsedStream } from './saveParsedStream';

describe('saveParsedStream', () => {
    describe('no publication', () => {
        const parsedStream = 'parsedStream';
        const ctx = {
            dataset: {
                count: jest.fn().mockImplementation(() => 'count'),
                updateMany: jest.fn(),
            },
            publishedDataset: {
                count: jest.fn().mockImplementation(() => 0),
                updateMany: jest.fn(),
            },
            field: {
                initializeModel: jest.fn(),
            },
            saveStream: jest.fn(),
        };
        let result: any;

        beforeAll(async () => {
            result = await saveParsedStream(ctx, parsedStream);
        });

        it('should return count', () => {
            expect(result).toBe('count');
        });

        it('should have called publishedDataset.count', () => {
            expect(ctx.publishedDataset.count).toHaveBeenCalled();
        });

        it('should have called saveStream with parsedStream', () => {
            expect(ctx.saveStream).toHaveBeenCalledWith('parsedStream', ctx);
        });

        it('should have called field.initializeModel', () => {
            expect(ctx.field.initializeModel).toHaveBeenCalled();
        });

        it('should have called dataset.count', () => {
            expect(ctx.dataset.count).toHaveBeenCalled();
        });

        it('should not have called updateMany on dataset and publishedDataset', () => {
            expect(ctx.dataset.updateMany).not.toHaveBeenCalled();
            expect(ctx.publishedDataset.updateMany).not.toHaveBeenCalled();
        });
    });

    describe('with publication', () => {
        const ctx = {
            dataset: {
                deleteOne: jest.fn(),
                count: jest.fn().mockImplementation(() => 'count'),
                updateMany: jest.fn(),
            },
            publishedDataset: {
                count: jest.fn().mockImplementation(() => 1000),
                updateMany: jest.fn(),
            },
            field: {
                findAll: jest
                    .fn()
                    .mockImplementation(() => [
                        { scope: 'collection' },
                        { scope: 'dataset' },
                    ]),
            },
            saveStream: jest.fn(),
            publishDocuments: jest.fn(),
            publishFacets: jest.fn(),
        };
        let result: any;
        const parsedStream = 'parsedStream';

        beforeAll(async () => {
            result = await saveParsedStream(ctx, parsedStream);
        });

        it('should return count', () => {
            expect(result).toBe('count');
        });

        it('should have called publishedDataset.count', () => {
            expect(ctx.publishedDataset.count).toHaveBeenCalled();
        });

        it('should not have called dataset.deleteOne', () => {
            expect(ctx.dataset.deleteOne).not.toHaveBeenCalled();
        });

        it('should not mark the rows as published itself: publishDocuments does it once they are', () => {
            expect(ctx.dataset.updateMany).not.toHaveBeenCalled();
            expect(ctx.publishedDataset.updateMany).not.toHaveBeenCalled();
        });

        it('should have called field.findAll', () => {
            expect(ctx.field.findAll).toHaveBeenCalled();
        });

        it('should count the rows not published yet, the ones of an earlier import included', () => {
            expect(ctx.dataset.count).toHaveBeenCalledWith({
                _lodexPublished: { $ne: true },
            });
        });

        it('should have called publishDocuments', () => {
            expect(ctx.publishDocuments).toHaveBeenCalledWith(ctx, 'count', [
                { scope: 'collection' },
            ]);
        });

        it('should have called publishFacets', () => {
            expect(ctx.publishFacets).toHaveBeenCalledWith(
                ctx,
                [{ scope: 'collection' }, { scope: 'dataset' }],
                false,
            );
        });

        it('should have called saveStream with parsedStream', () => {
            expect(ctx.saveStream).toHaveBeenCalledWith('parsedStream', ctx);
        });

        it('should have called dataset.count to count all document', () => {
            expect(ctx.dataset.count).toHaveBeenCalledWith();
        });
    });

    describe('with error during publication', () => {
        const parsedStream = 'parsedStream';
        const ctx = {
            dataset: {
                deleteOne: jest.fn(),
                count: jest.fn().mockImplementation(() => 'count'),
                updateMany: jest.fn(),
            },
            publishedDataset: {
                count: jest.fn().mockImplementation(() => 1000),
                updateMany: jest.fn(),
                deleteOne: jest.fn(),
            },
            field: {
                findAll: jest
                    .fn()
                    .mockImplementation(() => [
                        { scope: 'collection' },
                        { scope: 'dataset' },
                    ]),
            },
            saveStream: jest.fn(),
            publishDocuments: jest.fn().mockImplementation(() => {
                throw new Error('Error during publication');
            }),
            publishFacets: jest.fn(),
        };

        let result: any;

        beforeAll(async () => {
            result = await saveParsedStream(ctx, parsedStream).catch(
                (error: any) => error,
            );
        });

        it('should have thrown an error', () => {
            expect(result).toEqual(new Error('Error during publication'));
        });

        it('should have called publishedDataset.count', () => {
            expect(ctx.publishedDataset.count).toHaveBeenCalled();
        });

        it('should not mark the rows as published itself: publishDocuments does it once they are', () => {
            expect(ctx.dataset.updateMany).not.toHaveBeenCalled();
            expect(ctx.publishedDataset.updateMany).not.toHaveBeenCalled();
        });

        it('should have called field.findAll', () => {
            expect(ctx.field.findAll).toHaveBeenCalled();
        });

        it('should count the rows not published yet, the ones of an earlier import included', () => {
            expect(ctx.dataset.count).toHaveBeenCalledWith({
                _lodexPublished: { $ne: true },
            });
        });

        it('should have called publishDocuments', () => {
            expect(ctx.publishDocuments).toHaveBeenCalledWith(ctx, 'count', [
                { scope: 'collection' },
            ]);
        });

        it('should not have called publishFacets', () => {
            expect(ctx.publishFacets).not.toHaveBeenCalled();
        });

        it('should have called saveStream with parsedStream', () => {
            expect(ctx.saveStream).toHaveBeenCalledWith('parsedStream', ctx);
        });

        it('should keep the imported rows: the next publication publishes them', () => {
            expect(ctx.dataset.deleteOne).not.toHaveBeenCalled();
            expect(ctx.publishedDataset.deleteOne).not.toHaveBeenCalled();
        });
    });

    describe('import of a site generation, on a published dataset', () => {
        const ctx = {
            job: { data: { siteGenerationRunId: 'run-1' } },
            dataset: {
                count: jest.fn().mockImplementation(() => 'count'),
                updateMany: jest.fn(),
            },
            publishedDataset: {
                count: jest.fn().mockImplementation(() => 1000),
                updateMany: jest.fn(),
            },
            field: { findAll: jest.fn() },
            saveStream: jest.fn(),
            publishDocuments: jest.fn(),
            publishFacets: jest.fn(),
        };
        let result: any;

        beforeAll(async () => {
            result = await saveParsedStream(ctx, 'parsedStream');
        });

        it('should save the rows and return their count', () => {
            expect(ctx.saveStream).toHaveBeenCalledWith('parsedStream', ctx);
            expect(result).toBe('count');
        });

        it('should not publish: the generation publishes at its end', () => {
            expect(ctx.publishDocuments).not.toHaveBeenCalled();
            expect(ctx.publishFacets).not.toHaveBeenCalled();
        });

        it('should leave the rows unmarked, for the next publication', () => {
            expect(ctx.dataset.updateMany).not.toHaveBeenCalled();
        });
    });
});
