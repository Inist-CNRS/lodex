/* eslint max-len: off */
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
            versionTransformResult: jest
                .fn()
                .mockImplementation(() => 'transformDocumentAndKeepUri()'),
            dataset: {
                count: jest
                    .fn()
                    .mockImplementation(() => Promise.resolve('count')),
                findLimitFromSkip: 'dataset.findLimitFromSkip()',
            },
            field: {
                findAll: jest.fn().mockImplementation(() => fields),
            },
            publishedCharacteristic: {
                addNewVersion: jest.fn(),
            },
            publishedDataset: {
                findLimitFromSkip: jest
                    .fn()
                    .mockImplementation(() => publishedDataset),
                insertBatch: 'publishedDataset.insertBatch()',
                countByFacet: jest.fn().mockImplementation(() => 100),
            },
            redirect: jest.fn(),
            publishCharacteristics: jest.fn(),
            publishDocuments: jest.fn(),
            publishFacets: jest.fn(),
        };

        beforeAll(async () => {
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
    });

    describe('preparePublish', () => {
        it('should provide ctx with needed dependency', async () => {
            const ctx = {};
            const next = jest.fn();
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
                    remove: jest.fn(),
                },
                publishedCharacteristic: {
                    remove: jest.fn(),
                },
            };
            const error = new Error('Boom');
            const next = jest
                .fn()
                .mockImplementation(() => Promise.reject(error));
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
