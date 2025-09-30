import { MongoClient, type Db } from 'mongodb';
import config from 'config';
// @ts-expect-error TS(7016): Could not find a declaration file for module
import { DEFAULT_TENANT } from '../../common/tools/tenantTools';

/**
 * @type {Map<string, MongoClient>}
 */
const clients = new Map();

export const mongoConnectionString = (tenant: any) =>
    `mongodb://${config.get('mongo.host')}/${config.get('mongo.dbName')}_${
        tenant || DEFAULT_TENANT
    }`;

/**
 * Get the DBMS client
 * @param tenant Name of the Lodex instance
 * @returns {Promise<MongoClient>}
 */
const mongoClientConnectionFactory = async (tenant: any) => {
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

export default mongoClientFactory;
