import progress from './progress';
import indexSearchableFields from './indexSearchableFields';
import { CREATE_INDEX } from '../../common/progressStatus';

export default async ctx => {
    const count = await ctx.dataset.count({});

    const fields = await ctx.field.findAll();
    const collectionCoverFields = fields.filter(c => c.cover === 'collection');

    await ctx.publishDocuments(ctx, count, collectionCoverFields);

    // =================================
    // const collectionCoverSubresourceFields = fields.filter(
    //     c => c.cover === 'collection' && c.subresourceId,
    // );
    // console.log({ collectionCoverSubresourceFields });
    // await ctx.publishSubresourceDocuments(
    //     ctx,
    //     count,
    //     collectionCoverSubresourceFields,
    // );
    // =================================

    // const datasetCoverFields = fields.filter(c => c.cover === 'dataset');
    // await ctx.publishCharacteristics(ctx, datasetCoverFields, count);
    // await ctx.publishFacets(ctx, fields, true);
    // await ctx.publishFacets(ctx, fields, true);
    progress.start(CREATE_INDEX, null);
    // await indexSearchableFields();
    progress.finish();
};
