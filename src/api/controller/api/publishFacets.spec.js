import publishFacets from './publishFacets';

describe('publishFacets', () => {
    const ctx = {
        publishedDataset: {
            getFacetsForField: jest.fn().mockImplementation((name) => ({
                toArray: () =>
                    Promise.resolve([
                        {
                            field: name,
                            value: 'value1',
                            count: 100,
                        },
                        {
                            field: name,
                            value: 'value2',
                            count: 200,
                        },
                    ]),
            })),
        },
        publishedFacet: {
            insertMany: jest.fn().mockImplementation(() => Promise.resolve()),
            deleteOne: jest.fn(),
        },
    };
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
        await publishFacets(ctx, facetFields, false);
    });

    it('should call publishedDataset.getFacetsForField for each facet field', () => {
        expect(ctx.publishedDataset.getFacetsForField).toHaveBeenCalledWith(
            'facet1',
        );
        expect(ctx.publishedDataset.getFacetsForField).toHaveBeenCalledWith(
            'facet2',
        );
    });

    it('should call publishedFacet.deleteOne', () => {
        expect(ctx.publishedFacet.deleteOne).toHaveBeenCalled();
        expect(ctx.publishedFacet.deleteOne).toHaveBeenCalledWith({
            field: { $in: ['facet1', 'facet2', 'field2'] },
        });
    });

    it('should call ctx.publishedFacet.insertMany for each facet field with their distinct values', () => {
        expect(ctx.publishedFacet.insertMany).toHaveBeenCalledWith([
            { field: 'facet1', value: 'value1', count: 100 },
            { field: 'facet1', value: 'value2', count: 200 },
        ]);
        expect(ctx.publishedFacet.insertMany).toHaveBeenCalledWith([
            { field: 'facet2', value: 'value1', count: 100 },
            { field: 'facet2', value: 'value2', count: 200 },
        ]);
    });

    describe('with no facet', () => {
        beforeEach(() => {
            ctx.publishedFacet.deleteOne.mockClear();
            ctx.publishedFacet.insertMany.mockClear();
        });
        it('should do nothing', async () => {
            await publishFacets(
                ctx,
                [{ name: 'field1' }, { name: 'field2' }, { name: 'field3' }],
                false,
            );
            expect(ctx.publishedFacet.deleteOne).toHaveBeenCalledTimes(0);
            expect(ctx.publishedFacet.insertMany).toHaveBeenCalledTimes(0);
        });
    });
});
