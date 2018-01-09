import getDocumentTransformer from './getDocumentTransformer';
import getAddUriTransformer from './getAddUriTransformer';
import transformAllDocuments from './transformAllDocuments';

export const getVersionInitializer = transformDocument => async (
    doc,
    _,
    __,
    publicationDate = new Date(),
) => ({
    uri: doc.uri,
    versions: [
        {
            ...(await transformDocument(doc)),
            publicationDate,
        },
    ],
});

export const publishDocumentsFactory = ({
    getVersionInitializer,
    getDocumentTransformer,
    getAddUriTransformer,
    transformAllDocuments,
}) =>
    async function publishDocuments(ctx, count, fields) {
        const collectionCoverFields = fields.filter(
            c => c.cover === 'collection',
        );

        const uriCol = fields.find(col => col.name === 'uri');
        const addUri = getAddUriTransformer(ctx.dataset.findBy, uriCol);

        await transformAllDocuments(
            count,
            ctx.dataset.findLimitFromSkip,
            ctx.uriDataset.insertBatch,
            addUri,
        );

        const transformDocument = getDocumentTransformer(
            ctx.uriDataset.findBy,
            collectionCoverFields.filter(col => col.name !== 'uri'),
        );

        const initializeVersion = getVersionInitializer(transformDocument);

        const uriDocCount = await ctx.uriDataset.count({});
        await transformAllDocuments(
            uriDocCount,
            ctx.uriDataset.findLimitFromSkip,
            ctx.publishedDataset.insertBatch,
            initializeVersion,
        );
    };

export default publishDocumentsFactory({
    getVersionInitializer,
    getDocumentTransformer,
    getAddUriTransformer,
    transformAllDocuments,
});
