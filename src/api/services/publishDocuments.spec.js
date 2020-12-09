import {
    versionTransformerDecorator,
    publishDocumentsFactory,
} from './publishDocuments';

const fields = [
    { name: 'uri', cover: 'collection' },
    { name: 'field2', cover: 'collection' },
    { name: 'field3', cover: 'dataset' },
];

const getCtx = ({ subresources } = {}) => ({
    dataset: {
        findLimitFromSkip: 'dataset.findLimitFromSkip()',
        findBy: 'dataset.findBy()',
    },
    subresource: {
        findAll: jest.fn().mockImplementation(() => subresources || []),
    },
    uriDataset: {
        insertBatch: 'dataset.insertBatch()',
        findLimitFromSkip: 'dataset.findLimitFromSkip()',
        count: jest.fn().mockImplementation(() => 'count'),
        findBy: 'dataset.findBy()',
    },
    publishedDataset: {
        insertBatch: 'publishedDataset.insertBatch()',
    },
});

const getMocks = () => ({
    transformAllDocuments: jest.fn(),
    getDocumentTransformer: jest
        .fn()
        .mockImplementation(() => 'transformDocument()'),
    versionTransformerDecorator: jest
        .fn()
        .mockImplementation(() => 'initializeVersion()'),
});

describe('publishDocuments', () => {
    describe('without subresources', () => {
        const ctx = getCtx();

        const {
            versionTransformerDecorator,
            getDocumentTransformer,
            transformAllDocuments,
        } = getMocks();

        beforeAll(async () => {
            await publishDocumentsFactory({
                versionTransformerDecorator,
                getDocumentTransformer,
                transformAllDocuments,
            })(ctx, 'count', fields);
        });

        it('should call ctx.transformAllDocuments', () => {
            expect(transformAllDocuments).toHaveBeenCalledWith(
                'count',
                'dataset.findLimitFromSkip()',
                'publishedDataset.insertBatch()',
                'initializeVersion()',
            );
        });

        it('should call getDocumentTransformer with all other fields', () => {
            expect(
                getDocumentTransformer,
            ).toHaveBeenCalledWith('dataset.findBy()', [fields[0], fields[1]]);
        });

        it('should call versionTransformerDecorator with transformDocument', () => {
            expect(versionTransformerDecorator).toHaveBeenCalledWith(
                'transformDocument()',
            );
        });

        it('should call ctx.transformAllDocuments', () => {
            expect(transformAllDocuments).toHaveBeenCalledWith(
                'count',
                'dataset.findLimitFromSkip()',
                'publishedDataset.insertBatch()',
                'initializeVersion()',
            );
        });
    });

    describe('with subresources', () => {
        describe('without subresource fields', () => {
            const ctx = getCtx();

            const {
                versionTransformerDecorator,
                getDocumentTransformer,
                transformAllDocuments,
            } = getMocks();

            beforeAll(async () => {
                await publishDocumentsFactory({
                    versionTransformerDecorator,
                    getDocumentTransformer,
                    transformAllDocuments,
                })(ctx, 'count', fields);
            });

            it('should call ctx.transformAllDocuments one time (for main resource)', () => {
                expect(transformAllDocuments).toHaveBeenCalledTimes(1);
            });
        });

        describe('with subresource fields', () => {
            const ctx = getCtx({
                subresources: [{ _id: 'sub1', name: 'Subresource 1' }],
            });

            let {
                versionTransformerDecorator,
                getDocumentTransformer,
                transformAllDocuments,
            } = {};

            beforeEach(async () => {
                ({
                    versionTransformerDecorator,
                    getDocumentTransformer,
                    transformAllDocuments,
                } = getMocks());
            });

            it('should call ctx.transformDocuments one time if field subresource does not exist', async () => {
                await publishDocumentsFactory({
                    versionTransformerDecorator,
                    getDocumentTransformer,
                    transformAllDocuments,
                })(ctx, 'count', [
                    ...fields,
                    {
                        name: 'field2',
                        cover: 'collection',
                        collectionId: 'unknown',
                    },
                ]);

                expect(transformAllDocuments).toHaveBeenCalledTimes(1);
            });

            it('should call ctx.transformDocuments for each subresource', async () => {
                await publishDocumentsFactory({
                    versionTransformerDecorator,
                    getDocumentTransformer,
                    transformAllDocuments,
                })(ctx, 'count', [
                    ...fields,
                    {
                        name: 'field2',
                        cover: 'collection',
                        subresourceId: 'sub1',
                    },
                ]);

                expect(transformAllDocuments).toHaveBeenCalledTimes(2);
            });
        });
    });

    describe('versionTransformerDecorator', () => {
        it('should add doc.uri to transform result and move other keys as first version', async () => {
            const transform = jest.fn().mockImplementation(() => ({
                uri: 'transformedUri',
                transformed: 'data',
            }));
            const doc = {
                _id: 'id',
                uri: 'uri',
                data: 'value',
            };
            const date = new Date();
            expect(
                await versionTransformerDecorator(transform)(
                    doc,
                    null,
                    null,
                    date,
                ),
            ).toEqual({
                uri: 'transformedUri',
                subresourceId: null,
                versions: [
                    {
                        transformed: 'data',
                        publicationDate: date,
                    },
                ],
            });

            expect(transform).toHaveBeenCalledWith(doc);
        });
    });
});
