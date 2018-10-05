import MongoClient from 'mongodb';
import config from 'config';

let db = null;

export const mongoClientFactory = MongoClientImpl => async () => {
    if (!db) {
        db = await MongoClientImpl.connect(
            `mongodb://${config.mongo.host}/${config.mongo.dbName}`,
            {
                poolSize: 10,
            },
        );
    }
    return db;
};

export default mongoClientFactory(MongoClient);
