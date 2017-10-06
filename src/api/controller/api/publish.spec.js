/* eslint max-len: off */
import expect, { createSpy } from 'expect';

import {
    doPublish,
    preparePublish,
    handlePublishError,
    tranformAllDocuments,
    addTransformResultToDoc,
    versionTransformResult,
    publishCharacteristics,
} from './publish';
import getDocumentTransformer from '../../services/getDocumentTransformer';
import publishFacets from './publishFacets';

describe('publish', () => {
    describe('doPublish', () => {
        const fields = [
            { name: 'uri', cover: 'collection' },
            { name: 'field2', cover: 'collection' },
            { name: 'field3', cover: 'dataset' },
        ];

        const publishedDataset = [
            { field1: 'field1_value', field2: 'field2_value', field3: 'field3_value' },
        ];

        const ctx = {
            versionTransformResult: createSpy().andReturn('transformDocumentAndKeepUri()'),
            addTransformResultToDoc: createSpy().andReturn('addUri()'),
            dataset: {
                count: createSpy().andReturn(Promise.resolve('count')),
                findLimitFromSkip: 'dataset.findLimitFromSkip()',
            },
            field: {
                findAll: createSpy().andReturn(fields),
            },
            getDocumentTransformer: createSpy().andReturn('transformDocument()'),
            publishedCharacteristic: {
                addNewVersion: createSpy(),
            },
            publishedDataset: {
                findLimitFromSkip: createSpy().andReturn(publishedDataset),
                insertBatch: 'publishedDataset.insertBatch()',
                countByFacet: createSpy().andReturn(100),
            },
            redirect: createSpy(),
            tranformAllDocuments: createSpy(),
            uriDataset: {
                insertBatch: 'uriDataset.insertBatch()',
                findLimitFromSkip: 'uriDataset.findLimitFromSkip()',
                distinct: createSpy().andReturn({ length: 'count' }),
            },
            publishCharacteristics: createSpy(),
            publishFacets: createSpy(),
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
            expect(ctx.getDocumentTransformer).toHaveBeenCalledWith([fields[0]]);
        });

        it('should call ctx.addTransformResultToDoc with transformDocument', () => {
            expect(ctx.addTransformResultToDoc).toHaveBeenCalledWith('transformDocument()');
        });

        it('should call ctx.tranformAllDocuments', () => {
            expect(ctx.tranformAllDocuments).toHaveBeenCalledWith('count', 'dataset.findLimitFromSkip()', 'uriDataset.insertBatch()', 'addUri()');
        });

        it('should call getDocumentTransformer with all other fields', () => {
            expect(ctx.getDocumentTransformer).toHaveBeenCalledWith([fields[1]]);
        });

        it('should call ctx.versionTransformResult with transformDocument', () => {
            expect(ctx.versionTransformResult).toHaveBeenCalledWith('transformDocument()');
        });

        it('should call ctx.tranformAllDocuments', () => {
            expect(ctx.tranformAllDocuments).toHaveBeenCalledWith('count', 'uriDataset.findLimitFromSkip()', 'publishedDataset.insertBatch()', 'transformDocumentAndKeepUri()');
        });

        it('should call publishCharacteristics', () => {
            expect(ctx.publishCharacteristics).toHaveBeenCalledWith(ctx, [{
                name: 'field3',
                cover: 'dataset',
            }], 'count');
        });

        it('should redirect to the publication route', () => {
            expect(ctx.redirect).toHaveBeenCalledWith('/api/publication');
        });
    });

    describe('publishCharacteristics', () => {
        const transformDocument = createSpy().andReturn({ transformed: 'document' });
        const count = 5;
        const ctx = {
            getDocumentTransformer: createSpy().andReturn(transformDocument),
            uriDataset: {
                findLimitFromSkip: createSpy().andReturn(['doc']),
            },
            publishedCharacteristic: {
                addNewVersion: createSpy(),
            },
        };
        const datasetFields = [{
            name: 'transformed',
            scheme: 'scheme',
        }];

        before(async () => {
            await publishCharacteristics(ctx, datasetFields, count);
        });

        it('should call getDocumentTransformer', () => {
            expect(ctx.getDocumentTransformer)
                .toHaveBeenCalledWith(datasetFields);
        });

        it('should call ctx.uriDataset.findLimitFromSkip', () => {
            expect(ctx.uriDataset.findLimitFromSkip)
                .toHaveBeenCalledWith(1, count - 1);
        });

        it('should call transformDocument returned by getDocumentTransformer', () => {
            expect(transformDocument).toHaveBeenCalledWith('doc');
        });

        it('should call ctx.publishedCharacteristic.addNewVersion', () => {
            expect(ctx.publishedCharacteristic.addNewVersion).toHaveBeenCalledWith({
                transformed: 'document',
            });
        });
    });

    describe('preparePublish', () => {
        it('should provide ctx with needed dependency', async () => {
            const ctx = {};
            const next = createSpy();
            await preparePublish(ctx, next);

            expect(ctx).toEqual({
                tranformAllDocuments,
                getDocumentTransformer: getDocumentTransformer(ctx),
                addTransformResultToDoc,
                versionTransformResult,
                publishCharacteristics,
                publishFacets,
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
                publishedCharacteristic: {
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
                    expect(ctx.publishedCharacteristic.remove).toHaveBeenCalled();
                    done();
                })
                .catch(done);
        });
    });

    describe('tranformAllDocuments', () => {
        const dataset = {
            length: 1000,
            map: createSpy().andReturn(['transformed dataset']),
        };
        const count = 2001;
        const findLimitFromSkip = createSpy().andReturn(dataset);
        const insertBatch = createSpy();
        const transformDocument = createSpy().andReturn(Promise.resolve('transformedDocument'));

        before(async () => {
            await tranformAllDocuments(count, findLimitFromSkip, insertBatch, transformDocument);
        });
        it('should load items from the original dataset and insert them in the publishedDataset by page of 100', () => {
            expect(findLimitFromSkip).toHaveBeenCalledWith(1000, 0);
            expect(findLimitFromSkip).toHaveBeenCalledWith(1000, 1000);
            expect(findLimitFromSkip).toHaveBeenCalledWith(1000, 2000);
        });

        it('should map dataset to transformDocument', () => {
            expect(dataset.map).toHaveBeenCalledWith(transformDocument);
        });

        it('should insert all transformedDocument', () => {
            expect(insertBatch).toHaveBeenCalledWith(['transformed dataset']);
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

    describe('versionTransformResult', () => {
        it('should add doc.uri to transform result', async () => {
            const transform = createSpy().andReturn({ transformed: 'data' });
            const doc = {
                _id: 'id',
                uri: 'uri',
                data: 'value',
            };
            const date = new Date();
            expect(await versionTransformResult(transform)(doc, null, null, date)).toEqual({
                uri: 'uri',
                versions: [{
                    transformed: 'data',
                    publicationDate: date,
                }],
            });

            expect(transform).toHaveBeenCalledWith(doc);
        });
    });
});
