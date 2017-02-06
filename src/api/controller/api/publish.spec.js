/* eslint max-len: off */
import expect, { createSpy } from 'expect';

import {
    doPublish,
    preparePublish,
    handlePublishError,
    tranformAllDocuments,
    addTransformResultToDoc,
    addUriToTransformResult,
} from './publish';
import getDocumentTransformer from '../../../common/getDocumentTransformer';

describe('publish', () => {
    describe('doPublish', () => {
        const fields = ['uri', 'field1', 'field2'].map(name => ({ name }));

        const ctx = {
            dataset: {
                count: createSpy().andReturn(Promise.resolve('count')),
                findLimitFromSkip: 'dataset.findLimitFromSkip()',
            },
            uriDataset: {
                insertBatch: 'uriDataset.insertBatch()',
                findLimitFromSkip: 'uriDataset.findLimitFromSkip()',
            },
            field: {
                findAll: createSpy().andReturn(fields),
            },
            getDocumentTransformer: createSpy().andReturn('transformDocument()'),
            addUriToTransformResult: createSpy().andReturn('transformDocumentAndKeepUri()'),
            addTransformResultToDoc: createSpy().andReturn('addUri()'),
            publishedDataset: {
                insertBatch: 'publishedDataset.insertBatch()',
            },
            tranformAllDocuments: createSpy(),
            redirect: createSpy(),
        };

        before(async () => {
            await doPublish(ctx);
        });

        it('should get the total number of items in the original dataset', () => {
            expect(ctx.dataset.count).toHaveBeenCalledWith({});
        });

        it('should get the columns', () => {
            expect(ctx.field.findAll).toHaveBeenCalled();
        });

        it('should call getDocumentTransformer to get the uri transformers', () => {
            expect(ctx.getDocumentTransformer).toHaveBeenCalledWith({ env: 'node', dataset: ctx.dataset }, [fields[0]]);
        });

        it('should call ctx.addTransformResultToDoc with transformDocument', () => {
            expect(ctx.addTransformResultToDoc).toHaveBeenCalledWith('transformDocument()');
        });

        it('should call ctx.tranformAllDocuments', () => {
            expect(ctx.tranformAllDocuments).toHaveBeenCalledWith('count', 'dataset.findLimitFromSkip()', 'uriDataset.insertBatch()', 'addUri()');
        });

        it('should call getDocumentTransformer with all other fields', () => {
            expect(ctx.getDocumentTransformer).toHaveBeenCalledWith({ env: 'node', dataset: ctx.uriDataset }, fields.slice(1));
        });

        it('should call ctx.addUriToTransformResult with transformDocument', () => {
            expect(ctx.addUriToTransformResult).toHaveBeenCalledWith('transformDocument()');
        });

        it('should call ctx.tranformAllDocuments', () => {
            expect(ctx.tranformAllDocuments).toHaveBeenCalledWith('count', 'uriDataset.findLimitFromSkip()', 'publishedDataset.insertBatch()', 'transformDocumentAndKeepUri()');
        });


        it('should redirect to the publication route', () => {
            expect(ctx.redirect).toHaveBeenCalledWith('/api/publication');
        });
    });

    describe('preparePublish', () => {
        it('should provide ctx with needed dependency', async () => {
            const ctx = {};
            const next = createSpy();
            await preparePublish(ctx, next);

            expect(ctx).toEqual({
                tranformAllDocuments,
                getDocumentTransformer,
                addTransformResultToDoc,
                addUriToTransformResult,
            });
        });
    });

    describe('handlePublishError', () => {
        it('should remove uriDataset and publishedDataset if next fail', (done) => {
            const ctx = {
                uriDataset: {
                    remove: createSpy(),
                },
                publishedDataset: {
                    remove: createSpy(),
                },
            };
            const error = new Error('Boom');
            const next = createSpy().andReturn(Promise.reject(error));
            handlePublishError(ctx, next)
            .then(() => {
                throw new Error('tryPublish promise should have been rejected');
            })
            .catch((e) => {
                expect(e).toEqual(error);
                expect(ctx.uriDataset.remove).toHaveBeenCalled();
                expect(ctx.publishedDataset.remove).toHaveBeenCalled();
                done();
            })
            .catch(done);
        });
    });

    describe('tranformAllDocuments', () => {
        const dataset = [{ foo: 'foo1', bar: 'bar1' }, { foo: 'foo2', bar: 'bar2' }];
        const count = 201;
        const findLimitFromSkip = createSpy().andReturn(dataset);
        const insertBatch = createSpy();
        const transformDocument = createSpy().andReturn(Promise.resolve('transformedDocument'));

        before(async () => {
            await tranformAllDocuments(count, findLimitFromSkip, insertBatch, transformDocument);
        });
        it('should load items from the original dataset and insert them in the publishedDataset by page of 100', () => {
            expect(findLimitFromSkip).toHaveBeenCalledWith(100, 0);
            expect(findLimitFromSkip).toHaveBeenCalledWith(100, 200);
            expect(insertBatch).toHaveBeenCalledWith(['transformedDocument', 'transformedDocument']);
        });

        it('should call transform document with each document in dataset', () => {
            expect(transformDocument).toHaveBeenCalledWith(dataset[0], 0, dataset);
            expect(transformDocument).toHaveBeenCalledWith(dataset[1], 1, dataset);
        });

        it('should insert all transformedDocument', () => {
            expect(insertBatch).toHaveBeenCalledWith(['transformedDocument', 'transformedDocument']);
        });
    });

    describe('addTransformResultToDoc', () => {
        it('should add transform result to doc omitting doc._id', async () => {
            const transform = createSpy().andReturn({ transformed: 'data' });
            const doc = {
                _id: 'id',
                data: 'value',
            };

            expect(await addTransformResultToDoc(transform)(doc)).toEqual({
                data: 'value',
                transformed: 'data',
            });

            expect(transform).toHaveBeenCalledWith(doc);
        });
    });

    describe('addUriToTransformResult', () => {
        it('should add doc.uri to transform result', async () => {
            const transform = createSpy().andReturn({ transformed: 'data' });
            const doc = {
                _id: 'id',
                uri: 'uri',
                data: 'value',
            };

            expect(await addUriToTransformResult(transform)(doc)).toEqual({
                uri: 'uri',
                transformed: 'data',
            });

            expect(transform).toHaveBeenCalledWith(doc);
        });
    });
});
