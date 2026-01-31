import { DEFAULT_TENANT } from '@lodex/common';
import config from 'config';
import { MongoClient, type Db } from 'mongodb';

/**
 * @type {Map<string, MongoClient>}
 */
const clients = new Map();

export const mongoConnectionString = (tenant: string) =>
    process.env.NODE_ENV === 'test' && process.env.MONGODB_URI_FOR_TESTS
        ? process.env.MONGODB_URI_FOR_TESTS
        : `mongodb://${config.get('mongo.host')}/${config.get('mongo.dbName')}_${
              tenant || DEFAULT_TENANT
          }`;

/**
 * Get the DBMS client
 * @param tenant Name of the Lodex instance
 * @returns {Promise<MongoClient>}
 */
const mongoClientConnectionFactory = async (tenant: string) => {
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

export const mongoClientFactory = async (tenant: string): Promise<Db> => {
    return (await mongoClientConnectionFactory(tenant)).db();
};

export const closeDb = async (tenant: string) => {
    if (clients && clients.has(tenant)) {
        await clients.get(tenant).close();
    }
};

export type MongoClientFactory = typeof mongoClientFactory;

export default mongoClientFactory;
