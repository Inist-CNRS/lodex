import progress from './progress';
import indexSearchableFields from './indexSearchableFields';
import { CREATE_INDEX } from '../../common/progressStatus';

export default async ctx => {
    const count = await ctx.dataset.count({});

    const fields = await ctx.field.findAll();
    const collectionScopeFields = fields.filter(c => c.scope === 'collection');

    await ctx.publishDocuments(ctx, count, collectionScopeFields);

    const datasetScopeFields = fields.filter(c => c.scope === 'dataset');
    await ctx.publishCharacteristics(ctx, datasetScopeFields, count);
    await ctx.publishFacets(ctx, fields, true);
    await ctx.publishFacets(ctx, fields, true);
    progress.start(CREATE_INDEX, null);
    await indexSearchableFields();
    progress.finish();
};
