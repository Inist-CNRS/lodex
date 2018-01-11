import expect, { createSpy } from 'expect';

import saveParsedStream from './saveParsedStream';

describe('saveParsedStream', () => {
    describe('no publication', () => {
        const parsedStream = 'parsedStream';
        const ctx = {
            dataset: {
                remove: createSpy(),
                count: createSpy().andReturn('count'),
                updateMany: createSpy(),
            },
            uriDataset: {
                updateMany: createSpy(),
            },
            publishedDataset: {
                count: createSpy().andReturn(0),
                updateMany: createSpy(),
            },
            field: {
                initializeModel: createSpy(),
            },
            saveStream: createSpy(),
        };
        let result;

        before(async () => {
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

        it('should not have called updateMany on dataset, uriDataset and publishedDataset', () => {
            expect(ctx.dataset.updateMany).toNotHaveBeenCalled();
            expect(ctx.uriDataset.updateMany).toNotHaveBeenCalled();
            expect(ctx.publishedDataset.updateMany).toNotHaveBeenCalled();
        });
    });

    describe('with publication', () => {
        const ctx = {
            dataset: {
                remove: createSpy(),
                count: createSpy().andReturn('count'),
                updateMany: createSpy(),
            },
            uriDataset: {
                updateMany: createSpy(),
            },
            publishedDataset: {
                count: createSpy().andReturn(1000),
                updateMany: createSpy(),
            },
            field: {
                findAll: createSpy().andReturn([
                    { cover: 'collection' },
                    { cover: 'dataset' },
                ]),
            },
            saveStream: createSpy(),
            publishDocuments: createSpy(),
            publishFacets: createSpy(),
        };
        let result;
        const parsedStream = 'parsedStream';

        before(async () => {
            result = await saveParsedStream(ctx)(parsedStream);
        });

        it('should return count', () => {
            expect(result).toBe('count');
        });

        it('should have called publishedDataset.count', () => {
            expect(ctx.publishedDataset.count).toHaveBeenCalled();
        });

        it('should not have called dataset.remove', () => {
            expect(ctx.dataset.remove).toNotHaveBeenCalled();
        });

        it('should have called updateMany on dataset, uriDataset and publishedDataset to set lodex_published to true', () => {
            expect(ctx.dataset.updateMany).toHaveBeenCalledWith(
                {},
                { $set: { lodex_published: true } },
                { multi: true },
            );
            expect(ctx.uriDataset.updateMany).toHaveBeenCalledWith(
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
            expect(ctx.publishFacets).toHaveBeenCalledWith(ctx, [
                { cover: 'collection' },
                { cover: 'dataset' },
            ]);
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
                remove: createSpy(),
                count: createSpy().andReturn('count'),
                updateMany: createSpy(),
            },
            uriDataset: {
                updateMany: createSpy(),
                remove: createSpy(),
            },
            publishedDataset: {
                count: createSpy().andReturn(1000),
                updateMany: createSpy(),
                remove: createSpy(),
            },
            field: {
                findAll: createSpy().andReturn([
                    { cover: 'collection' },
                    { cover: 'dataset' },
                ]),
            },
            saveStream: createSpy(),
            publishDocuments: createSpy().andThrow(
                new Error('Error during publication'),
            ),
            publishFacets: createSpy(),
        };

        let result;

        before(async () => {
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

        it('should have called updateMany on dataset, uriDataset and publishedDataset to set lodex_published to true', () => {
            expect(ctx.dataset.updateMany).toHaveBeenCalledWith(
                {},
                { $set: { lodex_published: true } },
                { multi: true },
            );
            expect(ctx.uriDataset.updateMany).toHaveBeenCalledWith(
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
            expect(ctx.publishFacets).toNotHaveBeenCalled();
        });

        it('should have called saveStream with parsedStream', () => {
            expect(ctx.saveStream).toHaveBeenCalledWith('parsedStream');
        });

        it('should remove all unpublished document from dataset, uriDataset and publishedDataset', () => {
            expect(ctx.dataset.remove).toHaveBeenCalledWith({
                lodex_published: { $exists: false },
            });
            expect(ctx.uriDataset.remove).toHaveBeenCalledWith({
                lodex_published: { $exists: false },
            });
            expect(ctx.publishedDataset.remove).toHaveBeenCalledWith({
                lodex_published: { $exists: false },
            });
        });
    });
});
