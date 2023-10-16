import { MongoClient } from 'mongodb';
import config from 'config';

let db = [];

export const mongoConnectionString = tenant =>
    `mongodb://${config.mongo.host}/${config.mongo.dbName}_${tenant ||
        'default'}`;

export const mongoClientFactory = MongoClientImpl => async tenant => {
    if (!tenant) {
        throw new Error(
            `L'instance n'est pas renseigné, impossible de se connecter à la base de données.`,
        );
    }

    if (!db[tenant]) {
        try {
            db[tenant] = await MongoClientImpl.connect(
                mongoConnectionString(tenant),
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

export const closeDb = async tenant => {
    if (db && db[tenant]) {
        await db[tenant].close();
    }
};

export default mongoClientFactory(MongoClient);
