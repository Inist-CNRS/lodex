import path from 'path';
import mongoClient from './mongoClient';
import fs from 'fs';
import { REPO_ROOT } from '../paths';

export async function insertConfigTenant(tenantName: any) {
    const tenantDb = await mongoClient(tenantName);
    const configCollection = await tenantDb.collection('configTenant');
    if (await configCollection.findOne()) {
        return;
    }

    const file = fs.readFileSync(path.join(REPO_ROOT, 'configTenant.json'));
    // @ts-expect-error TS(2304): Cannot find name 'JSON'.
    const data = JSON.parse(file);
    await configCollection.insertOne(data);
}
