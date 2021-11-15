import composeAsync from '../../common/lib/composeAsync';
import mongoClient from './mongoClient';
import field from '../models/field';
import publishedDataset from '../models/publishedDataset';

export default async () => {
    ctx.job && ctx.job.log("Indexing fields");
    await composeAsync(
        await composeAsync(mongoClient, field, f => f.findSearchableNames)(),
        await composeAsync(
            mongoClient,
            publishedDataset,
            p => p.createTextIndexes,
        )(),
    )();
    ctx.job && ctx.job.log("Fields indexed");
};
