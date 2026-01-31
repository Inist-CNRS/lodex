import * as fs from 'fs';

import { MongoClient } from 'mongodb';
import { restoreModel } from './restoreModel';

describe('restoreModel', () => {
    let connection: any;
    let db: any;

    beforeAll(async () => {
        connection = await MongoClient.connect(
            String(process.env.MONGODB_URI_FOR_TESTS),
        );
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
            await restoreModel(process.env.MONGODB_URI_FOR_TESTS, stream, [
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
});
