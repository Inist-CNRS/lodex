import { MongoClient } from 'mongodb';
import config from 'config';

export const mongoConnectionString = `mongodb://${config.mongo.host}/`;
export const mongoClientFactory = MongoClientImpl => async tenant => {
    if (!tenant) {
        throw new Error(`Le tenant n'est pas renseigné.`);
    }
    try {
        return await MongoClientImpl.connect(mongoConnectionString + tenant, {
            poolSize: 10,
        });
    } catch (error) {
        console.error(error);
        throw new Error(
            `L'url de la base mongoDB n'est pas bonne, ou non renseignée.`,
        );
    }
};

export default mongoClientFactory(MongoClient);
