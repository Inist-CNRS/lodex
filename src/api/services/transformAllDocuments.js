import progress from './progress';

export default async function transformAllDocument(
    count,
    findLimitFromSkip,
    insertBatch,
    transformer,
) {
    let handled = 0;
    while (handled < count) {
        const dataset = await findLimitFromSkip(1000, handled, {
            lodex_published: { $exists: false },
        });
        const transformedDataset = await Promise.all(dataset.map(transformer));

        console.log({ dataset, transformedDataset });
        await insertBatch(transformedDataset);
        progress.incrementProgress(dataset.length);
        handled += dataset.length;
    }
}
