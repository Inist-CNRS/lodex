export default async function publishCharacteristics(
    ctx,
    datasetCoverFields,
    count,
) {
    if (!datasetCoverFields.length) {
        return;
    }
    const getPublishedCharacteristics = ctx.getDocumentTransformer(
        datasetCoverFields,
    );

    const [lastResource] = await ctx.uriDataset.findLimitFromSkip(1, count - 1);
    const characteristics = await getPublishedCharacteristics(lastResource);

    const characteristicsKeys = Object.keys(characteristics);

    if (characteristicsKeys.length) {
        const publishedCharacteristics = characteristicsKeys.reduce(
            (result, name) => ({
                ...result,
                [name]: characteristics[name],
            }),
            {},
        );

        await ctx.publishedCharacteristic.addNewVersion(
            publishedCharacteristics,
        );
    }
}
