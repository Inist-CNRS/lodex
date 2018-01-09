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

export default async function publishDocuments(ctx, count, fields) {
    const collectionCoverFields = fields.filter(c => c.cover === 'collection');

    const uriCol = fields.find(col => col.name === 'uri');
    const addUri = ctx.getAddUriTransformer(uriCol);

    await ctx.transformAllDocuments(
        count,
        ctx.dataset.findLimitFromSkip,
        ctx.uriDataset.insertBatch,
        addUri,
    );

    const transformDocument = ctx.getDocumentTransformer(
        collectionCoverFields.filter(col => col.name !== 'uri'),
    );

    const initializeVersion = getVersionInitializer(transformDocument);

    const uriDocCount = await ctx.uriDataset.count({});
    await ctx.transformAllDocuments(
        uriDocCount,
        ctx.uriDataset.findLimitFromSkip,
        ctx.publishedDataset.insertBatch,
        initializeVersion,
    );
}
