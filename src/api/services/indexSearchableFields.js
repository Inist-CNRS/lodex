import composeAsync from '../../common/lib/composeAsync';
import mongoClient from './mongoClient';
import field from '../models/field';
import publishedDataset from '../models/publishedDataset';
import progress from './progress';
import { CREATE_INDEX } from '../../common/progressStatus';

export default async () => {
    progress.start(CREATE_INDEX, null, null, 'publishing', null, 'publisher');
    return composeAsync(
        await composeAsync(mongoClient, field, f => f.findSearchableNames)(),
        await composeAsync(
            mongoClient,
            publishedDataset,
            p => p.createTextIndexes,
        )(),
    )();
};
