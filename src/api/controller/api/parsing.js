export default async function parsing(ctx) {
    const excerptLines = await ctx.dataset.getExcerpt();
    const totalLoadedLines = await ctx.dataset.count();

    ctx.body = {
        totalLoadedLines,
        excerptLines,
    };
}
