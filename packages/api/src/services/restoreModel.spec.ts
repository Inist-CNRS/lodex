import * as fs from 'fs';

import { MongoClient } from 'mongodb';
import * as tar from 'tar-stream';
import { CONFIG_TENANT_ENTRY, restoreModel } from './restoreModel';

describe('restoreModel', () => {
    const connectionStringURI = process.env.MONGODB_URI_FOR_TESTS as string;
    let connection: any;
    let db: any;

    beforeAll(async () => {
        connection = await MongoClient.connect(connectionStringURI);
        db = connection.db();
    });

    afterAll(async () => {
        await connection.close();
    });

    it('should restore model from a tar file', async () => {
        const stream = fs.createReadStream(
            './packages/api/src/services/restoreModel.testdata.tar',
        );

        try {
            await restoreModel(connectionStringURI, stream, [
                'field',
                'subresource',
                'enrichment',
                'precomputed',
            ]);

            expect(await db.collection('field').countDocuments()).toBe(1);
            expect(await db.collection('subresource').countDocuments()).toBe(0);
            expect(await db.collection('enrichment').countDocuments()).toBe(4);
            expect(await db.collection('precomputed').countDocuments()).toBe(0);
        } finally {
            stream.close();
        }
    });

    it('should return undefined config for an archive without tenant config', async () => {
        const stream = fs.createReadStream(
            './packages/api/src/services/restoreModel.testdata.tar',
        );

        try {
            const { configTenant } = await restoreModel(
                connectionStringURI,
                stream,
                ['field'],
            );

            expect(configTenant).toBeUndefined();
        } finally {
            stream.close();
        }
    });

    it('should return the tenant config without restoring it as a collection', async () => {
        const pack = tar.pack();
        pack.entry(
            { name: 'dataset/field/1.json' },
            JSON.stringify({ _id: '1', name: 'uri' }),
        );
        pack.entry(
            { name: CONFIG_TENANT_ENTRY },
            JSON.stringify({ theme: 'istex', front: { multilingual: true } }),
        );
        pack.finalize();

        const { configTenant } = await restoreModel(connectionStringURI, pack, [
            'field',
        ]);

        expect(configTenant).toEqual({
            theme: 'istex',
            front: { multilingual: true },
        });
        expect(await db.collection('field').countDocuments()).toBe(1);
    });
});
