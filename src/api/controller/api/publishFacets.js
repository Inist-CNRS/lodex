import progress from '../../services/progress';
import { PUBLISH_FACET } from '../../../common/progressStatus';

export default async (ctx, fields) => {
    const facetFields = fields.filter(c => c.isFacet);
    progress.start(PUBLISH_FACET, facetFields.length);

    const names = fields.map(({ name }) => name);
    await ctx.publishedFacet.remove({ field: { $in: names } });

    return Promise.all(
        facetFields.map(field =>
            ctx.publishedDataset
                .findDistinctValuesForField(field.name)
                .then(values =>
                    Promise.all(
                        values.map(value =>
                            ctx.publishedDataset
                                .countByFacet(field.name, value)
                                .then(count => ({ value, count })),
                        ),
                    ),
                )
                .then(values => {
                    progress.incrementProgress(1);
                    return ctx.publishedFacet.insertFacet(field.name, values);
                }),
        ),
    );
};
