import { MongoClient, type Db, type WithId, type Document } from 'mongodb';
import publishedFacetFactory, {
    type PublishedFacetCollection,
} from './publishedFacet';

interface FacetDocument extends WithId<Document> {
    field: string;
    value: string;
    count: number;
}

describe('publishedFacet', () => {
    const connectionStringURI = process.env.MONGO_URL;

    let connection: MongoClient;
    let db: Db;
    let publishedFacet: PublishedFacetCollection;

    beforeAll(async () => {
        connection = await MongoClient.connect(connectionStringURI!);
        db = connection.db();
    });

    afterAll(async () => {
        await connection.close();
    });

    beforeEach(async () => {
        await db.dropDatabase();
        publishedFacet = await publishedFacetFactory(db);

        await publishedFacet.insertMany([
            { field: 'foo', value: 'filter', count: 10 },
            { field: 'foo', value: 'filtré', count: 5 },
            { field: 'foo', value: 'Filtration', count: 3 },
            { field: 'foo', value: 'other', count: 2 },
            { field: 'bar', value: 'filter', count: 1 },
        ]);
    });

    describe('findValuesForField', () => {
        it('returns all values for a field when no filter is provided', async () => {
            const results = (await publishedFacet.findValuesForField({
                field: 'foo',
                page: 0,
                perPage: 10,
            })) as FacetDocument[];

            expect(results.map((r) => r.value).sort()).toStrictEqual([
                'Filtration',
                'filter',
                'filtré',
                'other',
            ]);
        });

        it('filters values using accent-insensitive and case-insensitive search', async () => {
            const results = (await publishedFacet.findValuesForField({
                field: 'foo',
                filter: 'filtre',
                page: 0,
                perPage: 10,
            })) as FacetDocument[];

            expect(results.map((r) => r.value)).toStrictEqual(['filtré']);
        });

        it.each([
            ['', 'empty string'],
            ['   ', 'whitespace only'],
        ])('ignores filter when it is %s (%s)', async (filter) => {
            const results = await publishedFacet.findValuesForField({
                field: 'foo',
                filter,
                page: 0,
                perPage: 10,
            });

            expect(results).toHaveLength(4);
        });

        it('applies pagination and sorting', async () => {
            const results = (await publishedFacet.findValuesForField({
                field: 'foo',
                sortBy: 'count',
                sortDir: 'ASC',
                perPage: 2,
                page: 0,
            })) as FacetDocument[];

            expect(results.map((r) => r.count)).toStrictEqual([2, 3]);
        });

        it('returns an empty array if no values match the filter', async () => {
            const results = await publishedFacet.findValuesForField({
                field: 'foo',
                filter: 'does-not-exist',
                page: 0,
                perPage: 10,
            });

            expect(results).toStrictEqual([]);
        });
    });

    describe('countValuesForField', () => {
        it('counts all values for a field when no filter is provided', async () => {
            const count = await publishedFacet.countValuesForField('foo');
            expect(count).toBe(4);
        });

        it('counts values using accent-insensitive filter', async () => {
            const count = await publishedFacet.countValuesForField(
                'foo',
                'filtre',
            );

            expect(count).toBe(1);
        });

        it.each(['', '   '])(
            'ignores filter when counting if filter is "%s"',
            async (filter) => {
                const count = await publishedFacet.countValuesForField(
                    'foo',
                    filter,
                );

                expect(count).toBe(4);
            },
        );

        it('returns 0 when no values match the filter', async () => {
            const count = await publishedFacet.countValuesForField(
                'foo',
                'unknown',
            );

            expect(count).toBe(0);
        });
    });
});
