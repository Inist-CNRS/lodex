import { MongoClient } from 'mongodb';
import publishFacets from './publishFacets';
import publishedFacet from '../../models/publishedFacet';
import publishedDataset from '../../models/publishedDataset';

describe('publishFacets', () => {
    const connectionStringURI = process.env.MONGODB_URI_FOR_TESTS;
    let db: any;
    let connection: any;
    let ctx: any;

    beforeAll(async () => {
        connection = await MongoClient.connect(connectionStringURI!);
        db = connection.db();
        ctx = {
            tenant: 'test',
            publishedFacet: await publishedFacet(db),
            publishedDataset: await publishedDataset(db),
        };
    });

    afterAll(async () => {
        await connection.close();
    });

    beforeEach(async () => {
        await db.collection('publishedDataset').deleteMany({});
        await db.collection('publishedFacet').deleteMany({});
    });

    const facetFields = [
        {
            name: 'facet1',
            isFacet: true,
        },
        {
            name: 'facet2',
            isFacet: true,
        },
        {
            name: 'field2',
        },
    ];

    beforeAll(async () => {
        await db.collection('publishedDataset').deleteMany({});
    });

    it('should publish facets in publishedFacet collection', async () => {
        await db.collection('publishedDataset').insertMany([
            {
                uri: 'uri1',
                versions: [{ facet1: 'value1', facet2: 'valueA' }],
            },
            {
                uri: 'uri2',
                versions: [{ facet1: 'value2', facet2: 'valueB' }],
            },
            {
                uri: 'uri3',
                versions: [{ facet1: 'value1', facet2: 'valueA' }],
            },
        ]);
        await publishFacets(ctx, facetFields, false);
        const facets = await ctx.publishedFacet
            .find()
            .sort({
                field: 1,
                value: 1,
            })
            .toArray();
        expect(facets.map(({ _id, ...facet }: any) => facet)).toStrictEqual([
            {
                count: 2,
                field: 'facet1',
                value: 'value1',
            },
            {
                count: 1,
                field: 'facet1',
                value: 'value2',
            },
            {
                count: 2,
                field: 'facet2',
                value: 'valueA',
            },
            {
                count: 1,
                field: 'facet2',
                value: 'valueB',
            },
        ]);
    });

    it('should only publish facets for given fields', async () => {
        await db.collection('publishedDataset').insertMany([
            {
                uri: 'uri1',
                versions: [{ facet1: 'value1', facet2: 'valueA' }],
            },
            {
                uri: 'uri2',
                versions: [{ facet1: 'value2', facet2: 'valueB' }],
            },
            {
                uri: 'uri3',
                versions: [{ facet1: 'value1', facet2: 'valueA' }],
            },
        ]);
        await publishFacets(
            ctx,
            [
                {
                    name: 'facet1',
                    isFacet: true,
                },
                {
                    name: 'field2',
                },
            ],
            false,
        );
        const facets = await ctx.publishedFacet
            .find()
            .sort({
                field: 1,
                value: 1,
            })
            .toArray();
        expect(facets.map(({ _id, ...facet }: any) => facet)).toStrictEqual([
            {
                count: 2,
                field: 'facet1',
                value: 'value1',
            },
            {
                count: 1,
                field: 'facet1',
                value: 'value2',
            },
        ]);
    });

    it('should remove previous facets before publishing new ones', async () => {
        await db.collection('publishedDataset').insertMany([
            {
                uri: 'uri1',
                versions: [{ facet1: 'value1' }],
            },
        ]);
        await ctx.publishedFacet.insertMany([
            {
                field: 'facet1',
                value: 'oldValue',
                count: 5,
            },
            {
                field: 'facet2',
                value: 'oldValue',
                count: 3,
            },
        ]);
        await publishFacets(ctx, facetFields, false);
        const facets = await ctx.publishedFacet
            .find()
            .sort({
                field: 1,
                value: 1,
            })
            .toArray();
        expect(facets.map(({ _id, ...facet }: any) => facet)).toStrictEqual([
            {
                count: 1,
                field: 'facet1',
                value: 'value1',
            },
        ]);
    });

    it('should keep existing facets of fields not republished', async () => {
        await db.collection('publishedDataset').insertMany([
            {
                uri: 'uri1',
                versions: [{ facet1: 'value1', facet2: 'valueA' }],
            },
            {
                uri: 'uri2',
                versions: [{ facet1: 'value2', facet2: 'valueB' }],
            },
            {
                uri: 'uri3',
                versions: [{ facet1: 'value1', facet2: 'valueA' }],
            },
        ]);
        await ctx.publishedFacet.insertMany([
            {
                field: 'facet2',
                value: 'oldValue',
                count: 3,
            },
            {
                field: 'facet1',
                value: 'oldValue',
                count: 30,
            },
        ]);
        await publishFacets(
            ctx,
            [
                {
                    name: 'facet1',
                    isFacet: true,
                },
            ],
            false,
        );
        const facets = await ctx.publishedFacet
            .find()
            .sort({
                field: 1,
                value: 1,
            })
            .toArray();
        expect(facets.map(({ _id, ...facet }: any) => facet)).toStrictEqual([
            {
                count: 2,
                field: 'facet1',
                value: 'value1',
            },
            {
                count: 1,
                field: 'facet1',
                value: 'value2',
            },
            {
                count: 3,
                field: 'facet2',
                value: 'oldValue',
            },
        ]);
    });
});
