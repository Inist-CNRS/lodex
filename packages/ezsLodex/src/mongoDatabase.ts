import { MongoClient } from 'mongodb';

export const handles = {};

/**
 * @param connectionStringURI {string}
 * @returns {Promise<import('mongodb').Db>}
 */
async function mongoDatabase(connectionStringURI: any) {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    if (!handles[connectionStringURI]) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        handles[connectionStringURI] = new MongoClient(connectionStringURI);
    }
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const client = await handles[connectionStringURI].connect();
    return client.db();
}

export default mongoDatabase;
