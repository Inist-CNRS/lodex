import mongoClient from '../services/mongoClient';
import fs from 'fs';

export async function insertConfigTenant(tenantName) {
    const tenantDb = await mongoClient(tenantName);
    const configCollection = await tenantDb.collection('configTenant');
    const file = fs.readFileSync('./configTenant.json');
    // save file as json in mongo
    const data = JSON.parse(file);
    await configCollection.insertOne(data);
}
