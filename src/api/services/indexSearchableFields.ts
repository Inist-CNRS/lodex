import { composeAsync } from '@lodex/common';
import mongoClient from './mongoClient';
import field from '../models/field';
import publishedDataset from '../models/publishedDataset';

export default async (ctx: any) => {
    return composeAsync(
        await composeAsync(
            () => mongoClient(ctx?.tenant),
            field,
            (f: any) => f.findSearchableNames,
        )(),
        await composeAsync(
            () => mongoClient(ctx?.tenant),
            publishedDataset,
            (p: any) => p.createTextIndexes,
        )(),
    )();
};
