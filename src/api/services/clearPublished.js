import { UNPUBLISH_DOCUMENT } from '../../common/progressStatus';
import progress from './progress';

export default async (ctx, triggeredFromPublication) => {
    progress.start(ctx.tenant, {
        status: UNPUBLISH_DOCUMENT,
        target: 100,
        label: triggeredFromPublication ? 'publishing' : UNPUBLISH_DOCUMENT,
        type: 'publisher',
    });
    await ctx.dataset.updateMany(
        {},
        { $unset: { lodex_published: '' } },
        { multi: true },
    );
    progress.incrementProgress(ctx.tenant, 25);
    await ctx.publishedDataset.deleteMany({});
    progress.incrementProgress(ctx.tenant, 25);
    await ctx.publishedCharacteristic.deleteMany({});
    progress.incrementProgress(ctx.tenant, 25);
    await ctx.publishedFacet.deleteMany({});
    progress.finish(ctx.tenant);
};
