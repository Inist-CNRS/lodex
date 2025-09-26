// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import composeAsync from '../../common/lib/composeAsync';
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
