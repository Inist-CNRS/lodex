import progress from '../../services/progress';
import { PUBLISH_FACET } from '../../../common/progressStatus';

export default async (ctx, fields) => {
    const facetFields = fields.filter(c => c.isFacet);
    progress.start(PUBLISH_FACET, facetFields.length);

    const names = fields.map(({ name }) => name);
    await ctx.publishedFacet.remove({ field: { $in: names } });

    return facetFields.reduce(
        async (prevPromise, field) =>
            prevPromise.then(async () => {
                progress.incrementProgress(1);
                const facets = await ctx.publishedDataset
                    .getFacetsForField(field.name)
                    .toArray();
                await ctx.publishedFacet.insertMany(facets);
            }),
        Promise.resolve(),
    );
};
