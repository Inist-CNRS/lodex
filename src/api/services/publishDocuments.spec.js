import progress from './progress';
import {
    versionTransformerDecorator,
    publishDocumentsFactory,
    getFieldsFromSubresourceFields,
} from './publishDocuments';

const fields = [
    {
        name: 'uri',
        scope: 'collection',
        transformers: [
            {
                operation: 'COLUMN',
                args: [{ name: 'column', type: 'column', value: 'uri' }],
            },
        ],
    },
    { name: 'field2', scope: 'collection' },
    { name: 'field3', scope: 'dataset' },
];

const job = {
    log: jest.fn(),
    isActive: () => true,
    data: {
        tenant: 'lodex_test',
    },
};
const getCtx = ({ subresources } = {}) => ({
    tenant: 'lodex_test',
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
    hiddenResource: {
        findAll: jest.fn().mockImplementation(() => null),
    },
    job,
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
            progress.initialize('lodex_test');
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
                undefined,
                job,
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
                null,
                null,
            );
        });

        it('should call ctx.transformAllDocuments', () => {
            expect(transformAllDocuments).toHaveBeenCalledWith(
                'count',
                'dataset.findLimitFromSkip()',
                'publishedDataset.insertBatch()',
                'initializeVersion()',
                undefined,
                job,
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
                        scope: 'collection',
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
                        scope: 'collection',
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

    describe('getFieldsFromSubresourceFields', () => {
        it('should return fields from subressource fields without column transformers', async () => {
            const fieldsFromSubressource = [
                {
                    name: 'Test',
                    scope: 'collection',
                    transformers: [
                        {
                            operation: 'COLUMN',
                            args: [
                                {
                                    name: 'column',
                                    type: 'column',
                                    value: 'uri',
                                },
                            ],
                        },
                    ],
                },
            ];

            const result = getFieldsFromSubresourceFields(
                fieldsFromSubressource,
                true,
            );
            expect(result[0]).toHaveProperty('transformers');
            expect(result[0].transformers).toHaveLength(0);
        });

        it('should return empty transformers if there is only one transformer COLUMN', async () => {
            const fieldsFromSubressource = [
                {
                    name: 'Test',
                    scope: 'collection',
                    transformers: [
                        {
                            operation: 'COLUMN',
                            args: [
                                {
                                    name: 'column',
                                    type: 'column',
                                    value: 'uri',
                                },
                            ],
                        },
                    ],
                },
            ];

            const result = getFieldsFromSubresourceFields(
                fieldsFromSubressource,
                true,
            );
            expect(result[0]).toHaveProperty('transformers');
            expect(result[0].transformers).toHaveLength(0);
        });

        it('should return fields with transformers if there is only one transformer who is not COLUMN', async () => {
            const fieldsFromSubressource = [
                {
                    name: 'Test',
                    scope: 'collection',
                    transformers: [
                        {
                            operation: 'VALUE',
                            args: [
                                {
                                    name: 'value',
                                    type: 'string',
                                    value: 'test',
                                },
                            ],
                        },
                    ],
                },
            ];

            const result = getFieldsFromSubresourceFields(
                fieldsFromSubressource,
                true,
            );
            expect(result[0].transformers).toEqual([
                {
                    operation: 'VALUE',
                    args: [{ name: 'value', type: 'string', value: 'test' }],
                },
            ]);
        });

        it('should return fields without COLUMN transformers if it is in first position', async () => {
            const fieldsFromSubressource = [
                {
                    name: 'Test',
                    scope: 'collection',
                    transformers: [
                        {
                            operation: 'COLUMN',
                            args: [
                                {
                                    name: 'column',
                                    type: 'column',
                                    value: 'uri',
                                },
                            ],
                        },
                        {
                            operation: 'VALUE',
                            args: [
                                {
                                    name: 'value',
                                    type: 'string',
                                    value: 'test',
                                },
                            ],
                        },
                    ],
                },
            ];

            const result = getFieldsFromSubresourceFields(
                fieldsFromSubressource,
                true,
            );
            expect(result[0].transformers).toEqual([
                {
                    operation: 'VALUE',
                    args: [{ name: 'value', type: 'string', value: 'test' }],
                },
            ]);
        });
    });
});
