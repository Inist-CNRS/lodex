import { MongoClient } from 'mongodb';
import config from 'config';

let clients = new Map();

export const mongoConnectionString = tenant =>
    `mongodb://${config.mongo.host}/${config.mongo.dbName}_${tenant ||
        'default'}`;

export const mongoClientConnectionFactory = async tenant => {
    if (!tenant) {
        throw new Error(
            `L'instance n'est pas renseigné, impossible de se connecter à la base de données.`,
        );
    }

    if (clients.has(tenant)) {
        return clients.get(tenant);
    }

    try {
        const client = new MongoClient(mongoConnectionString(tenant), {
            maxPoolSize: 10,
        });
        clients.set(tenant, await client.connect());
        return client;
    } catch (error) {
        console.error(error);
        throw new Error(
            `L'url de la base mongoDB n'est pas bonne, ou non renseignée.`,
        );
    }
};

export const mongoClientFactory = async tenant => {
    return (await mongoClientConnectionFactory(tenant)).db();
};

export default mongoClientFactory;
