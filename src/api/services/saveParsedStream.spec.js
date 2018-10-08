import saveParsedStream from './saveParsedStream';

describe('saveParsedStream', () => {
    describe('no publication', () => {
        const parsedStream = 'parsedStream';
        const ctx = {
            dataset: {
                remove: jest.fn(),
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
        let result;

        beforeAll(async () => {
            result = await saveParsedStream(ctx)(parsedStream);
        });

        it('should return count', () => {
            expect(result).toBe('count');
        });

        it('should have called publishedDataset.count', () => {
            expect(ctx.publishedDataset.count).toHaveBeenCalled();
        });

        it('should have called dataset.remove', () => {
            expect(ctx.dataset.remove).toHaveBeenCalled();
        });

        it('should have called saveStream with parsedStream', () => {
            expect(ctx.saveStream).toHaveBeenCalledWith('parsedStream');
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
                remove: jest.fn(),
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
                        { cover: 'collection' },
                        { cover: 'dataset' },
                    ]),
            },
            saveStream: jest.fn(),
            publishDocuments: jest.fn(),
            publishFacets: jest.fn(),
        };
        let result;
        const parsedStream = 'parsedStream';

        beforeAll(async () => {
            result = await saveParsedStream(ctx)(parsedStream);
        });

        it('should return count', () => {
            expect(result).toBe('count');
        });

        it('should have called publishedDataset.count', () => {
            expect(ctx.publishedDataset.count).toHaveBeenCalled();
        });

        it('should not have called dataset.remove', () => {
            expect(ctx.dataset.remove).not.toHaveBeenCalled();
        });

        it('should have called updateMany on dataset and publishedDataset to set lodex_published to true', () => {
            expect(ctx.dataset.updateMany).toHaveBeenCalledWith(
                {},
                { $set: { lodex_published: true } },
                { multi: true },
            );
            expect(ctx.publishedDataset.updateMany).toHaveBeenCalledWith(
                {},
                { $set: { lodex_published: true } },
                { multi: true },
            );
        });

        it('should have called field.findAll', () => {
            expect(ctx.field.findAll).toHaveBeenCalled();
        });

        it('should have called dataset.count to count unpublished document', () => {
            expect(ctx.dataset.count).toHaveBeenCalledWith({
                lodex_published: { $exists: false },
            });
        });

        it('should have called publishDocuments', () => {
            expect(ctx.publishDocuments).toHaveBeenCalledWith(ctx, 'count', [
                { cover: 'collection' },
            ]);
        });

        it('should have called publishFacets', () => {
            expect(ctx.publishFacets).toHaveBeenCalledWith(
                ctx,
                [{ cover: 'collection' }, { cover: 'dataset' }],
                false,
            );
        });

        it('should have called saveStream with parsedStream', () => {
            expect(ctx.saveStream).toHaveBeenCalledWith('parsedStream');
        });

        it('should have called dataset.count to count all document', () => {
            expect(ctx.dataset.count).toHaveBeenCalledWith();
        });
    });

    describe('with error during publication', () => {
        const parsedStream = 'parsedStream';
        const ctx = {
            dataset: {
                remove: jest.fn(),
                count: jest.fn().mockImplementation(() => 'count'),
                updateMany: jest.fn(),
            },
            publishedDataset: {
                count: jest.fn().mockImplementation(() => 1000),
                updateMany: jest.fn(),
                remove: jest.fn(),
            },
            field: {
                findAll: jest
                    .fn()
                    .mockImplementation(() => [
                        { cover: 'collection' },
                        { cover: 'dataset' },
                    ]),
            },
            saveStream: jest.fn(),
            publishDocuments: jest.fn().mockImplementation(() => {
                throw new Error('Error during publication');
            }),
            publishFacets: jest.fn(),
        };

        let result;

        beforeAll(async () => {
            result = await saveParsedStream(ctx)(parsedStream).catch(
                error => error,
            );
        });

        it('should have thrown an error', () => {
            expect(result).toEqual(new Error('Error during publication'));
        });

        it('should have called publishedDataset.count', () => {
            expect(ctx.publishedDataset.count).toHaveBeenCalled();
        });

        it('should have called updateMany on dataset and publishedDataset to set lodex_published to true', () => {
            expect(ctx.dataset.updateMany).toHaveBeenCalledWith(
                {},
                { $set: { lodex_published: true } },
                { multi: true },
            );
            expect(ctx.publishedDataset.updateMany).toHaveBeenCalledWith(
                {},
                { $set: { lodex_published: true } },
                { multi: true },
            );
        });

        it('should have called field.findAll', () => {
            expect(ctx.field.findAll).toHaveBeenCalled();
        });

        it('should have called dataset.count to count unpublished document', () => {
            expect(ctx.dataset.count).toHaveBeenCalledWith({
                lodex_published: { $exists: false },
            });
        });

        it('should have called publishDocuments', () => {
            expect(ctx.publishDocuments).toHaveBeenCalledWith(ctx, 'count', [
                { cover: 'collection' },
            ]);
        });

        it('should not have called publishFacets', () => {
            expect(ctx.publishFacets).not.toHaveBeenCalled();
        });

        it('should have called saveStream with parsedStream', () => {
            expect(ctx.saveStream).toHaveBeenCalledWith('parsedStream');
        });

        it('should remove all unpublished document from dataset and publishedDataset', () => {
            expect(ctx.dataset.remove).toHaveBeenCalledWith({
                lodex_published: { $exists: false },
            });
            expect(ctx.publishedDataset.remove).toHaveBeenCalledWith({
                lodex_published: { $exists: false },
            });
        });
    });
});
