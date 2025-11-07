import path from 'path';
import mongoClient from './mongoClient';
import fs from 'fs';

export async function insertConfigTenant(tenantName: any) {
    const tenantDb = await mongoClient(tenantName);
    const configCollection = await tenantDb.collection('configTenant');
    if (await configCollection.findOne()) {
        return;
    }

    const file = fs.readFileSync(
        path.join(__dirname, '../../../../configTenant.json'),
    );
    // @ts-expect-error TS(2304): Cannot find name 'JSON'.
    const data = JSON.parse(file);
    await configCollection.insertOne(data);
}
