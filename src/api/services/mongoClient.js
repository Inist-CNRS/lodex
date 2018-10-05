import { MongoClient } from 'mongodb';
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

    const close = db.close.bind(db);
    db.close = () => {
        close();
    };
    return db;
};

export default mongoClientFactory(MongoClient);
