import { MongoClient } from 'mongodb';
import config from 'config';
import dataset from '../models/dataset';
import field from '../models/field';
import publishedDataset from '../models/publishedDataset';
import publishedCharacteristic from '../models/publishedCharacteristic';
import uriDataset from '../models/uriDataset';

export const mongoClientFactory = MongoClientImpl => async (ctx, next) => {
    ctx.db = await MongoClientImpl.connect(`mongodb://${config.mongo.host}/${config.mongo.dbName}`);
    ctx.dataset = await dataset(ctx.db);
    ctx.field = await field(ctx.db);
    ctx.publishedDataset = await publishedDataset(ctx.db);
    ctx.publishedCharacteristic = await publishedCharacteristic(ctx.db);
    ctx.uriDataset = await uriDataset(ctx.db);

    try {
        await next();
    } finally {
        if (!ctx.keepDbOpened) {
            await ctx.db.close();
        }
    }
};

export default mongoClientFactory(MongoClient);
