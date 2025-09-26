// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { UNPUBLISH_DOCUMENT } from '../../common/progressStatus';
import progress from './progress';

export default async (ctx: any, triggeredFromPublication: any) => {
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
