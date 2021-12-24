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

export default async ctx => {
    const count = await ctx.dataset.count({});
    const fields = await ctx.field.findAll();

    const collectionScopeFields = fields.filter(c =>
        [SCOPE_COLLECTION, SCOPE_DOCUMENT].includes(c.scope),
    );

    (await isJobActive(ctx)) && (await clearPublished(ctx));
    (await isJobActive(ctx)) &&
        (await ctx.publishDocuments(ctx, count, collectionScopeFields));

    const datasetScopeFields = fields.filter(c =>
        [SCOPE_DATASET, SCOPE_GRAPHIC].includes(c.scope),
    );
    (await isJobActive(ctx)) &&
        (await ctx.publishCharacteristics(ctx, datasetScopeFields, count));

    (await isJobActive(ctx)) && (await ctx.publishFacets(ctx, fields, true));

    (await isJobActive(ctx)) && (await indexSearchableFields());

    progress.finish();
};
