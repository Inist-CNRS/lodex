import composeAsync from '../../common/lib/composeAsync';
import mongoClient from './mongoClient';
import field from '../models/field';
import publishedDataset from '../models/publishedDataset';

export default async () => {
    return composeAsync(
        await composeAsync(mongoClient, field, f => f.findSearchableNames)(),
        await composeAsync(
            mongoClient,
            publishedDataset,
            p => p.createTextIndexes,
        )(),
    )();
};
