import { buildVectorSearchPipeline } from '../src/buildVectorSearchPipeline';

describe('buildVectorSearchPipeline', () => {
    const base = {
        queryVector: [0.1, 0.2],
        filter: {},
        filterDocuments: { uri: { $ne: 'uid:/a' } },
        minScore: 0.75,
    };

    it('uses the limit and enough candidates', () => {
        const [{ $vectorSearch }] = buildVectorSearchPipeline({
            ...base,
            limit: 28,
        }) as any[];
        expect($vectorSearch).toMatchObject({
            index: 'vector_index',
            path: 'value',
            limit: 28,
            numCandidates: 280,
        });
    });

    it.each([
        [10, 150],
        [28, 280],
        [5000, 10000],
    ])('limit %i gives %i candidates', (limit, numCandidates) => {
        const pipeline = buildVectorSearchPipeline({ ...base, limit });
        expect((pipeline[0] as any).$vectorSearch.numCandidates).toBe(
            numCandidates,
        );
    });

    it('clamps the limit to 10000', () => {
        const [{ $vectorSearch }] = buildVectorSearchPipeline({
            ...base,
            limit: 20000,
        }) as any[];
        expect($vectorSearch.limit).toBe(10000);
        expect($vectorSearch.numCandidates).toBe(10000);
    });

    it.each([{ uri: { $ne: 'uid:/a' } }, {}])(
        'sorts by descending score just before the lookup (filter %j)',
        (filterDocuments) => {
            const pipeline = buildVectorSearchPipeline({
                ...base,
                filterDocuments,
                limit: 10,
            });
            const lookupIndex = pipeline.findIndex((s: any) => '$lookup' in s);
            expect(pipeline[lookupIndex - 1]).toEqual({
                $sort: { value: -1 },
            });
        },
    );

    it('keeps a resource exactly at the threshold, before the lookup', () => {
        const pipeline = buildVectorSearchPipeline({ ...base, limit: 10 });
        const lookupIndex = pipeline.findIndex((s: any) => '$lookup' in s);
        expect((pipeline[lookupIndex - 2] as any).$match).toEqual({
            value: { $gte: 0.75 },
        });
        expect((pipeline[lookupIndex + 1] as any).$match).toEqual({
            documents: { $elemMatch: { uri: { $ne: 'uid:/a' } } },
        });
    });

    it('does not filter without document filter (current behaviour)', () => {
        const pipeline = buildVectorSearchPipeline({
            ...base,
            filterDocuments: {},
            limit: 10,
        });
        const matches = pipeline.filter((s: any) => '$match' in s);
        expect(
            matches.every((s: any) => Object.keys(s.$match).length === 0),
        ).toBe(true);
    });
});
