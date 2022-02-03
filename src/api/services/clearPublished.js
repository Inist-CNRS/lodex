import { UNPUBLISH_DOCUMENT } from '../../common/progressStatus';
import progress from './progress';

export default async (ctx, triggeredFromPublication) => {
    progress.start({
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
    progress.incrementProgress(25);
    await ctx.publishedDataset.remove({});
    progress.incrementProgress(25);
    await ctx.publishedCharacteristic.remove({});
    progress.incrementProgress(25);
    await ctx.publishedFacet.remove({});
    progress.finish();
};
