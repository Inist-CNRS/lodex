import progress from '../../services/progress';
import { PUBLISH_FACET } from '../../../common/progressStatus';

export default async (ctx, fields, withProgress = false) => {
    const facetFields = fields.filter(c => c.isFacet);
    if (!facetFields.length) {
        withProgress && progress.finish();
        return;
    }
    withProgress && progress.start(PUBLISH_FACET, facetFields.length);

    const names = fields.map(({ name }) => name);
    await ctx.publishedFacet.remove({ field: { $in: names } });

    return facetFields
        .reduce(
            async (prevPromise, field) =>
                prevPromise.then(async () => {
                    const facets = await ctx.publishedDataset
                        .getFacetsForField(field.name)
                        .toArray();
                    if (!facets.length) {
                        return null;
                    }
                    await ctx.publishedFacet.insertMany(facets);
                    withProgress && progress.incrementProgress(1);
                }),
            Promise.resolve(),
        )
        .catch(error => {
            if (!withProgress) {
                throw error;
            }
            progress.throw(error);
        });
};
