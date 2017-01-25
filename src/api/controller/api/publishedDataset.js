export default async (ctx) => {
    const { page = 0, perPage = 20 } = ctx.request.query;
    const intPage = parseInt(page, 10);
    const intPerPage = parseInt(perPage, 10);

    const [data, total] = await Promise.all([
        ctx.publishedDataset.find({}).skip(intPage * intPerPage).limit(intPerPage).toArray(),
        ctx.publishedDataset.count(),
    ]);

    ctx.body = {
        total,
        data,
    };
};
