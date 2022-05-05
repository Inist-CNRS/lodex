import { MongoClient } from 'mongodb';
import config from 'config';

let db = null;

export const mongoConnectionString = `mongodb://${config.mongo.host}/${config.mongo.dbName}`;

export const mongoClientFactory = MongoClientImpl => async () => {
    if (!db) {
        try {
            db = await MongoClientImpl.connect(mongoConnectionString, {
                poolSize: 10,
            });
        } catch (error) {
            console.error(error);
            throw new Error(
                `L'url de la base mongoDB n'est pas bonne, ou non renseignée.`,
            );
        }
    }

    return db;
};

export default mongoClientFactory(MongoClient);
