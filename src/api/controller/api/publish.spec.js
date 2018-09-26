/* eslint max-len: off */
import expect, { createSpy } from 'expect';

import { doPublish, preparePublish, handlePublishError } from './publish';
import publishCharacteristics from '../../services/publishCharacteristics';
import publishDocuments from '../../services/publishDocuments';
import publishFacets from './publishFacets';

describe('publish', () => {
    describe('doPublish', () => {
        const fields = [
            { name: 'uri', cover: 'collection' },
            { name: 'field2', cover: 'collection' },
            { name: 'field3', cover: 'dataset' },
        ];

        const publishedDataset = [
            {
                field1: 'field1_value',
                field2: 'field2_value',
                field3: 'field3_value',
            },
        ];

        const ctx = {
            versionTransformResult: createSpy().andReturn(
                'transformDocumentAndKeepUri()',
            ),
            dataset: {
                count: createSpy().andReturn(Promise.resolve('count')),
                findLimitFromSkip: 'dataset.findLimitFromSkip()',
            },
            field: {
                findAll: createSpy().andReturn(fields),
            },
            publishedCharacteristic: {
                addNewVersion: createSpy(),
            },
            publishedDataset: {
                findLimitFromSkip: createSpy().andReturn(publishedDataset),
                insertBatch: 'publishedDataset.insertBatch()',
                countByFacet: createSpy().andReturn(100),
            },
            redirect: createSpy(),
            publishCharacteristics: createSpy(),
            publishDocuments: createSpy(),
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

        it('should call publishDocuments', () => {
            expect(ctx.publishDocuments).toHaveBeenCalledWith(ctx, 'count', [
                { name: 'uri', cover: 'collection' },
                { name: 'field2', cover: 'collection' },
            ]);
        });

        it('should call publishCharacteristics', () => {
            expect(ctx.publishCharacteristics).toHaveBeenCalledWith(
                ctx,
                [
                    {
                        name: 'field3',
                        cover: 'dataset',
                    },
                ],
                'count',
            );
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
                publishCharacteristics,
                publishDocuments,
                publishFacets,
            });
        });
    });

    describe('handlePublishError', () => {
        it('should remove publishedDataset and publishedCharacteristic if next fail', done => {
            const ctx = {
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
                    throw new Error(
                        'tryPublish promise should have been rejected',
                    );
                })
                .catch(e => {
                    expect(e).toEqual(error);
                    expect(ctx.publishedDataset.remove).toHaveBeenCalled();
                    expect(
                        ctx.publishedCharacteristic.remove,
                    ).toHaveBeenCalled();
                    done();
                })
                .catch(done);
        });
    });
});
