export default async function transformAllDocument(
    count,
    findLimitFromSkip,
    insertBatch,
    transformer,
) {
    let handled = 0;
    while (handled < count) {
        const dataset = await findLimitFromSkip(1000, handled, {
            _lodex_published: { $exists: false },
        });
        const transformedDataset = await Promise.all(dataset.map(transformer));
        await insertBatch(transformedDataset);
        handled += dataset.length;
    }
}
