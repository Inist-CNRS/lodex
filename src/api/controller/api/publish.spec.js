/* eslint max-len: off */
import expect, { createSpy } from 'expect';
import { publishMiddleware as publish } from './publish';

describe('publish', () => {
    const dataset = [{ foo: 'foo1', bar: 'bar1' }, { foo: 'foo2', bar: 'bar2' }];
    const fields = ['field1', 'field2'];
    const transformDocument = createSpy().andReturn(Promise.resolve('transformedDocument'));

    const ctx = {
        dataset: {
            count: createSpy().andReturn(Promise.resolve(201)),
            findLimitFromSkip: createSpy().andReturn(dataset),
        },
        ezMasterConfig: { naan: '55555' },
        field: {
            insertMany: createSpy(),
            findAll: createSpy().andReturn(fields),
        },
        getDocumentTransformer: createSpy().andReturn(transformDocument),
        publishedDataset: {
            insertMany: createSpy(),
        },
        redirect: createSpy(),
    };

    beforeEach(async () => {
        await publish(ctx);
    });

    it('should get the total number of items in the original dataset', () => {
        expect(ctx.dataset.count).toHaveBeenCalledWith({});
    });

    it('should get the columns', () => {
        expect(ctx.field.findAll).toHaveBeenCalled();
    });

    it('should get the transformers', () => {
        expect(ctx.getDocumentTransformer).toHaveBeenCalledWith({ env: 'node', dataset: ctx.dataset }, fields);
    });

    it('should load items from the original dataset and insert them in the publishedDataset by page of 100', () => {
        expect(ctx.dataset.findLimitFromSkip).toHaveBeenCalledWith(100, 0);
        expect(ctx.dataset.findLimitFromSkip).toHaveBeenCalledWith(100, 200);
        expect(ctx.publishedDataset.insertMany).toHaveBeenCalledWith(['transformedDocument', 'transformedDocument']);
    });

    it('should call transform document with each document in dataset', () => {
        expect(transformDocument).toHaveBeenCalledWith(dataset[0], 0, dataset);
        expect(transformDocument).toHaveBeenCalledWith(dataset[1], 1, dataset);
    });

    it('should insert all transformedDocument', () => {
        expect(ctx.publishedDataset.insertMany).toHaveBeenCalledWith(['transformedDocument', 'transformedDocument']);
    });

    it('should redirect to the publication route', () => {
        expect(ctx.redirect).toHaveBeenCalledWith('/api/publication');
    });
});
