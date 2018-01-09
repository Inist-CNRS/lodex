import expect, { createSpy } from 'expect';

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
        },
        field: {
            findAll: createSpy().andReturn(fields),
        },
        getDocumentTransformer: createSpy().andReturn('transformDocument()'),
        getAddUriTransformer: createSpy().andReturn('addUriToDocument()'),
        redirect: createSpy(),
        transformAllDocuments: createSpy(),
        uriDataset: {
            insertBatch: 'uriDataset.insertBatch()',
            findLimitFromSkip: 'uriDataset.findLimitFromSkip()',
            count: createSpy().andReturn('count'),
        },
        publishedDataset: {
            insertBatch: 'publishedDataset.insertBatch()',
        },
    };
    const getVersionInitializerMock = createSpy().andReturn(
        'initializeVersion()',
    );

    before(async () => {
        await publishDocumentsFactory({
            getVersionInitializer: getVersionInitializerMock,
        })(ctx, 'count', fields);
    });

    it('should call getAddUriTransformer to get the uri transformers', () => {
        expect(ctx.getAddUriTransformer).toHaveBeenCalledWith({
            name: 'uri',
            cover: 'collection',
        });
    });

    it('should call ctx.transformAllDocuments', () => {
        expect(ctx.transformAllDocuments).toHaveBeenCalledWith(
            'count',
            'dataset.findLimitFromSkip()',
            'uriDataset.insertBatch()',
            'addUriToDocument()',
        );
    });

    it('should call getDocumentTransformer with all other fields', () => {
        expect(ctx.getDocumentTransformer).toHaveBeenCalledWith([fields[1]]);
    });

    it('should call getVersionInitializer with transformDocument', () => {
        expect(getVersionInitializerMock).toHaveBeenCalledWith(
            'transformDocument()',
        );
    });

    it('should call ctx.transformAllDocuments', () => {
        expect(ctx.transformAllDocuments).toHaveBeenCalledWith(
            'count',
            'uriDataset.findLimitFromSkip()',
            'publishedDataset.insertBatch()',
            'initializeVersion()',
        );
    });

    describe('getVersionInitializer', () => {
        it('should add doc.uri to transform result and move other keys as first version', async () => {
            const transform = createSpy().andReturn({ transformed: 'data' });
            const doc = {
                _id: 'id',
                uri: 'uri',
                data: 'value',
            };
            const date = new Date();
            expect(
                await getVersionInitializer(transform)(doc, null, null, date),
            ).toEqual({
                uri: 'uri',
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
