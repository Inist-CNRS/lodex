import { MongoClient } from 'mongodb';
import config from 'config';
import dataset from '../models/dataset';
import field from '../models/field';
import publishedDataset from '../models/publishedDataset';
import publishedCharacteristic from '../models/publishedCharacteristic';
import uriDataset from '../models/uriDataset';

export default async (ctx, next) => {
    ctx.db = await MongoClient.connect(`mongodb://${config.mongo.host}/${config.mongo.dbName}`);
    ctx.dataset = await dataset(ctx.db);
    ctx.field = await field(ctx.db);
    ctx.publishedDataset = await publishedDataset(ctx.db);
    ctx.publishedCharacteristic = await publishedCharacteristic(ctx.db);
    ctx.uriDataset = await uriDataset(ctx.db);

    try {
        await next();
    } finally {
        await ctx.db.close();
    }
};
