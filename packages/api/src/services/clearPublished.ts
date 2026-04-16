import { ProgressStatus } from '@lodex/common';
import progress from './progress';

export default async (ctx: any, triggeredFromPublication: any) => {
    progress.start(ctx.tenant, {
        status: ProgressStatus.UNPUBLISH_DOCUMENT,
        target: 100,
        label: triggeredFromPublication
            ? 'publishing'
            : ProgressStatus.UNPUBLISH_DOCUMENT,
        type: 'publisher',
    });
    await ctx.dataset.updateMany(
        {},
        { $set: { lodex_published: false } },
        { multi: true },
    );
    progress.incrementProgress(ctx.tenant, 25);
    await ctx.publishedDataset.deleteIndexes();
    await ctx.publishedDataset.deleteMany({});
    progress.incrementProgress(ctx.tenant, 25);
    await ctx.publishedCharacteristic.deleteMany({});
    progress.incrementProgress(ctx.tenant, 25);
    await ctx.publishedFacet.deleteMany({});
    progress.finish(ctx.tenant);
};
