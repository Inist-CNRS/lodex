// @ts-expect-error TS(2792): Cannot find module '@ezs/core'.
import ezs from '@ezs/core';
// @ts-expect-error TS(1259): Module 'from' has no default export.
import from from 'from';
import { MongoClient } from 'mongodb';
import ezsLodex from '../src';
import { handles } from '../src/mongoDatabase';

ezs.use(ezsLodex);

describe('paginateQuery', () => {
    const connectionStringURI = process.env.MONGODB_URI_FOR_TESTS as string;
    let connection: any;
    let db: any;

    beforeAll(async () => {
        connection = await MongoClient.connect(connectionStringURI);
        db = connection.db();
        // more than two batches (BATCH_SIZE = 100), plus a removed document
        await db
            .collection('dataset')
            .insertMany([
                ...Array.from({ length: 250 }, (_, i) => ({ uri: `uri-${i}` })),
                { uri: 'removed', removedAt: new Date() },
            ]);
    });

    afterAll(async () => {
        await db.dropDatabase();
        await Promise.all(
            // @ts-expect-error TS(7053): handles is indexed by connection string
            Object.keys(handles).map((key) => handles[key].close()),
        );
        await connection.close();
    });

    const run = (params: Record<string, unknown> = {}): Promise<any[]> =>
        new Promise((resolve, reject) => {
            const res: any[] = [];
            from([{ connectionStringURI }])
                .pipe(
                    ezs('paginateQuery', {
                        collection: 'dataset',
                        ...params,
                    }),
                )
                .on('data', (data: any) => res.push(data))
                .on('end', () => resolve(res))
                .on('error', reject);
        });

    it('reads every document once, in _id order, across batches', async () => {
        const res = await run();
        expect(res).toHaveLength(250);
        expect(new Set(res.map(({ uri }) => uri)).size).toBe(250);
        expect(res.map(({ uri }) => uri)).toEqual(
            Array.from({ length: 250 }, (_, i) => `uri-${i}`),
        );
        expect(res[0].total).toBe(250);
    });

    it('applies skip and limit', async () => {
        const res = await run({ skip: 95, limit: 10 });
        expect(res.map(({ uri }) => uri)).toEqual(
            Array.from({ length: 10 }, (_, i) => `uri-${95 + i}`),
        );
    });
});
