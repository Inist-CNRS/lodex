import {
    getVersionInitializer,
    publishDocumentsFactory,
} from './publishDocuments';

describe('publishDocuments', () => {
    const fields = [
        { name: 'uri', cover: 'collection' },
        { name: 'field2', cover: 'collection' },
        { name: 'field3', cover: 'dataset' },
    ];

    const ctx = {
        dataset: {
            findLimitFromSkip: 'dataset.findLimitFromSkip()',
            findBy: 'dataset.findBy()',
        },
        field: {
            findAll: jest.fn().mockImplementation(() => fields),
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
    };

    const getDocumentTransformer = jest
        .fn()
        .mockImplementation(() => 'transformDocument()');
    const transformAllDocuments = jest.fn();

    const getVersionInitializerMock = jest
        .fn()
        .mockImplementation(() => 'initializeVersion()');

    beforeAll(async () => {
        await publishDocumentsFactory({
            getVersionInitializer: getVersionInitializerMock,
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
        expect(getDocumentTransformer).toHaveBeenCalledWith(
            'dataset.findBy()',
            [fields[0], fields[1]],
        );
    });

    it('should call getVersionInitializer with transformDocument', () => {
        expect(getVersionInitializerMock).toHaveBeenCalledWith(
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

    describe('getVersionInitializer', () => {
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
                await getVersionInitializer(transform)(doc, null, null, date),
            ).toEqual({
                uri: 'transformedUri',
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
