// @ts-expect-error TS(6133): 'Db' is declared but its value is never read.

import { MongoClient, Db } from 'mongodb';
// @ts-expect-error TS(2792): Cannot find module 'config'. Did you mean to set t... Remove this comment to see the full error message
import config from 'config';
// @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { DEFAULT_TENANT } from '../../common/tools/tenantTools';

/**
 * @type {Map<string, MongoClient>}
 */
const clients = new Map();

export const mongoConnectionString = (tenant: any) =>
    `mongodb://${config.mongo.host}/${config.mongo.dbName}_${
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

/**
 * Get the database client
 * @param tenant Name of the Lodex instance
 * @returns {Promise<Db>}
 */
export const mongoClientFactory = async (tenant: any) => {
    return (await mongoClientConnectionFactory(tenant)).db();
};

export const closeDb = async (tenant: any) => {
    if (clients && clients.has(tenant)) {
        await clients.get(tenant).close();
    }
};

export default mongoClientFactory;
