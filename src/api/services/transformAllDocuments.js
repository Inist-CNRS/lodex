import progress from './progress';
import { mongo } from 'config';

export default async function transformAllDocument(
    count,
    findLimitFromSkip,
    insertBatch,
    transformer,
    datasetChunkExtractor = x => x,
    job,
) {
    let handled = 0;
    const isJobActive = async () => {
        return !job || (job.isActive && (await job.isActive()));
    };

    while (handled < count) {
        if (!(await isJobActive())) {
            break;
        }

        const dataset = datasetChunkExtractor(
            await findLimitFromSkip(200, handled, {
                lodex_published: { $exists: false },
            }),
        );
        // avoid infinite loop
        if (dataset.length === 0) {
            handled = count;
        }

        const transformedDataset = (
            await Promise.all(dataset.map(transformer))
        ).filter(x => x);
        await insertBatch(transformedDataset);
        progress.incrementProgress(
            job.data.tenant || mongo.dbName,
            transformedDataset.filter(({ subresourceId }) => !subresourceId)
                .length,
        );
        handled += dataset.length;
    }
}
