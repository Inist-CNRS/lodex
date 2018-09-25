import omit from 'lodash.omit';
import getDocumentTransformer from './getDocumentTransformer';
import transformAllDocuments from './transformAllDocuments';
import progress from './progress';

export const getVersionInitializer = transformDocument => async (
    doc,
    _,
    __,
    publicationDate = new Date(),
) => {
    const transformedDoc = await transformDocument(doc);

    return {
        uri: transformedDoc.uri,
        versions: [
            {
                ...omit(transformedDoc, ['uri']),
                publicationDate,
            },
        ],
    };
};

export const publishDocumentsFactory = ({
    getVersionInitializer,
    getDocumentTransformer,
    transformAllDocuments,
}) =>
    async function publishDocuments(ctx, count, fields) {
        const collectionCoverFields = fields.filter(
            c => c.cover === 'collection',
        );

        const transformDocument = getDocumentTransformer(
            ctx.dataset.findBy,
            collectionCoverFields,
        );

        const initializeVersion = getVersionInitializer(transformDocument);

        progress.start('Publishing documents', count);
        await transformAllDocuments(
            count,
            ctx.dataset.findLimitFromSkip,
            ctx.publishedDataset.insertBatch,
            initializeVersion,
        );

        progress.finish();
    };

export default publishDocumentsFactory({
    getVersionInitializer,
    getDocumentTransformer,
    transformAllDocuments,
});
