
import dataset from '../../models/dataset';

export default async function parsing(ctx) {
    const excerptLines = await dataset(ctx.db).find().limit(5)
    .toArray();
    const totalLoadedLines = await ctx.dataset.count();

    ctx.body = {
        totalLoadedLines,
        excerptLines,
    };
}
