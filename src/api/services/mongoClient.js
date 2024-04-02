// eslint-disable-next-line no-unused-vars
import { MongoClient, Db } from 'mongodb';
import config from 'config';
import { DEFAULT_TENANT } from '../../common/tools/tenantTools';

/**
 * @type {Map<string, MongoClient>}
 */
let clients = new Map();

export const mongoConnectionString = (tenant) =>
    `mongodb://${config.mongo.host}/${config.mongo.dbName}_${
        tenant || DEFAULT_TENANT
    }`;

/**
 * Get the DBMS client
 * @param tenant Name of the Lodex instance
 * @returns {Promise<MongoClient>}
 */
const mongoClientConnectionFactory = async (tenant) => {
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

/**
 * Get the database client
 * @param tenant Name of the Lodex instance
 * @returns {Promise<Db>}
 */
export const mongoClientFactory = async (tenant) => {
    return (await mongoClientConnectionFactory(tenant)).db();
};

export const closeDb = async (tenant) => {
    if (clients && clients.has(tenant)) {
        await clients.get(tenant).close();
    }
};

export default mongoClientFactory;
