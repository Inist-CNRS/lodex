import progress from './progress';
import config from 'config';

const mongo = config.get('mongo');

export default async function transformAllDocument(
    count: any,
    findLimitFromSkip: any,
    insertBatch: any,
    transformer: any,
    datasetChunkExtractor = (x: any) => x,
    job: any,
) {
    let handled = 0;
    const chunkSize = 200;
    const isJobActive = async () => {
        return !job || (job.isActive && (await job.isActive()));
    };

    while (handled < count) {
        if (!(await isJobActive())) {
            break;
        }

        const dataset = datasetChunkExtractor(
            await findLimitFromSkip(chunkSize, handled, {
                lodex_published: { $exists: false },
            }),
        );
        // avoid infinite loop
        if (dataset.length === 0) {
            handled = count;
        }

        const transformedDataset = (
            await Promise.all(dataset.map(transformer))
        ).filter((x: any) => x);
        await insertBatch(transformedDataset);
        progress.incrementProgress(
            // @ts-expect-error TS(18046): mongo is of type unknown
            job?.data?.tenant || mongo.dbName,
            transformedDataset.filter(
                ({ subresourceId }: any) => !subresourceId,
            ).length,
        );
        handled += chunkSize;
    }
}
