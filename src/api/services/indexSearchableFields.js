import composeAsync from '../../common/lib/composeAsync';
import mongoClient from './mongoClient';
import field from '../models/field';
import publishedDataset from '../models/publishedDataset';

export default async ctx => {
    return composeAsync(
        await composeAsync(
            () => mongoClient(ctx.tenant),
            field,
            f => f.findSearchableNames,
        )(),
        await composeAsync(
            () => mongoClient(ctx.tenant),
            publishedDataset,
            p => p.createTextIndexes,
        )(),
    )();
};
