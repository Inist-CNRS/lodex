import { doPublish, preparePublish, handlePublishError } from './publish';
import publishCharacteristics from '../../services/publishCharacteristics';
import publishDocuments from '../../services/publishDocuments';
import publishFacets from './publishFacets';

describe('publish', () => {
    describe('doPublish', () => {
        const fields = [
            { name: 'uri', scope: 'collection' },
            { name: 'field2', scope: 'collection' },
            { name: 'field3', scope: 'dataset' },
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
                { name: 'uri', scope: 'collection' },
                { name: 'field2', scope: 'collection' },
            ]);
        });

        it('should call publishCharacteristics', () => {
            expect(ctx.publishCharacteristics).toHaveBeenCalledWith(
                ctx,
                [
                    {
                        name: 'field3',
                        scope: 'dataset',
                    },
                ],
                'count',
            );
        });
    });
});
