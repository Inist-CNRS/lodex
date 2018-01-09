import getDocumentTransformer from './getDocumentTransformer';

export const publishCharacteristicsFactory = ({ getDocumentTransformer }) =>
    async function publishCharacteristics(ctx, datasetCoverFields, count) {
        if (!datasetCoverFields.length) {
            return;
        }
        const getPublishedCharacteristics = getDocumentTransformer(
            ctx.uriDataset.findBy,
            datasetCoverFields,
        );

        const [lastResource] = await ctx.uriDataset.findLimitFromSkip(
            1,
            count - 1,
        );
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
    };

export default publishCharacteristicsFactory({ getDocumentTransformer });
