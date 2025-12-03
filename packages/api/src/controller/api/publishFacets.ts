import { ProgressStatus } from '@lodex/common';
import progress from '../../services/progress';
import { jobLogger } from '../../workers/tools';

export default async (ctx: any, fields: any, withProgress = false) => {
    const facetFields = fields.filter((c: any) => c.isFacet);
    if (!facetFields.length) {
        if (withProgress) {
            progress.finish(ctx.tenant);
        }
        return;
    }
    if (withProgress) {
        progress.start(ctx.tenant, {
            status: ProgressStatus.PUBLISH_FACET,
            target: facetFields.length,
            label: 'publishing',
            type: 'publisher',
        });
    }

    jobLogger.info(ctx.job, 'Publishing facets');

    const names = fields.map(({ name }: any) => name);
    await ctx.publishedFacet.deleteMany({ field: { $in: names } });

    await facetFields
        .reduce(
            async (prevPromise: any, field: any) =>
                prevPromise.then(async () => {
                    const facets = await ctx.publishedDataset.getFacetsForField(
                        field.name,
                    );
                    if (!facets.length) {
                        return null;
                    }
                    await ctx.publishedFacet.insertMany(facets);
                    if (withProgress) {
                        progress.incrementProgress(ctx.tenant, 1);
                    }
                }),
            Promise.resolve(),
        )
        .catch((error: any) => {
            if (!withProgress) {
                throw error;
            }
            progress.throw(ctx.tenant, error);
        });
    if (withProgress) {
        progress.finish(ctx.tenant);
    }

    jobLogger.info(ctx.job, 'Facets published');
};
