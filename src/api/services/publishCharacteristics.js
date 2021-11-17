import getDocumentTransformer from './getDocumentTransformer';

export const publishCharacteristicsFactory = ({ getDocumentTransformer }) =>
    async function publishCharacteristics(ctx, datasetScopeFields, count) {
        if (!datasetScopeFields.length) {
            return;
        }

        ctx.job && ctx.job.log("Publishing characteristics");
        const getPublishedCharacteristics = getDocumentTransformer(
            ctx.dataset.findBy,
            datasetScopeFields,
        );

        const [lastResource] = await ctx.dataset.findLimitFromSkip(
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
        ctx.job && ctx.job.log("Characteristics published");
    };

export default publishCharacteristicsFactory({ getDocumentTransformer });
