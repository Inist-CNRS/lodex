import progress from './progress';
import indexSearchableFields from './indexSearchableFields';
import clearPublished from './clearPublished';
import {
    SCOPE_COLLECTION,
    SCOPE_DATASET,
    SCOPE_DOCUMENT,
    SCOPE_GRAPHIC,
} from '../../common/scope';

const isJobActive = async ctx => !ctx.job || (await ctx.job.isActive());

const chainWhileJobIsActive = async (operations, ctx) => {
    let operationIndex = 0;
    let isActive = await isJobActive(ctx);
    while (isActive && operationIndex < operations.length) {
        const operation = operations[operationIndex];
        await operation();
        operationIndex++;
        isActive = await isJobActive(ctx);
    }
};

export default async ctx => {
    const count = await ctx.dataset.count({});
    const fields = await ctx.field.findAll();

    const collectionScopeFields = fields.filter(c =>
        [SCOPE_COLLECTION, SCOPE_DOCUMENT].includes(c.scope),
    );

    await chainWhileJobIsActive(
        [
            async () => await clearPublished(ctx, true),
            async () =>
                await ctx.publishDocuments(ctx, count, collectionScopeFields),
            async () => {
                const datasetScopeFields = fields.filter(c =>
                    [SCOPE_DATASET, SCOPE_GRAPHIC].includes(c.scope),
                );
                await ctx.publishCharacteristics(
                    ctx,
                    datasetScopeFields,
                    count,
                );
            },
            async () => await ctx.publishFacets(ctx, fields, true),
            async () => await indexSearchableFields(),
        ],
        ctx,
    );

    progress.finish();
};
