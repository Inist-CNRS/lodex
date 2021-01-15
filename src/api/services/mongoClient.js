import { MongoClient } from 'mongodb';
import config from 'config';

let db = null;

export const mongoConnectionString = `mongodb://${config.mongo.host}/${config.mongo.dbName}`;

export const mongoClientFactory = MongoClientImpl => async () => {
    if (!db) {
        db = await MongoClientImpl.connect(mongoConnectionString, {
            poolSize: 10,
        });
    }

    return db;
};

export default mongoClientFactory(MongoClient);
