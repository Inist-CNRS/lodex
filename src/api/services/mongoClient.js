import { MongoClient } from 'mongodb';
import config from 'config';
import dataset from '../models/dataset';

export default async (ctx, next) => {
    ctx.db = await MongoClient.connect(`mongodb://${config.mongo.host}/${config.mongo.dbName}`);
    ctx.dataset = dataset(ctx.db);
    try {
        await next();
    } finally {
        await ctx.db.close();
    }
};
