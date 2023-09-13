import { MongoClient } from 'mongodb';
import config from 'config';

let db = [];

export const mongoConnectionString = `mongodb://${config.mongo.host}/${config.mongo.dbName}`;

export const mongoClientFactory = MongoClientImpl => async tenant => {
    if (!db[tenant]) {
        try {
            db[tenant] = await MongoClientImpl.connect(
                mongoConnectionString + tenant,
                {
                    poolSize: 10,
                },
            );
        } catch (error) {
            console.error(error);
            throw new Error(
                `L'url de la base mongoDB n'est pas bonne, ou non renseignée.`,
            );
        }
    }

    return db[tenant];
};

export default mongoClientFactory(MongoClient);
