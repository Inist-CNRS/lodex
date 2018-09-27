/* eslint max-len: off */
import expect, { createSpy } from 'expect';
import publishFacets from './publishFacets';

describe('publishFacets', () => {
    const ctx = {
        publishedDataset: {
            getFacetsForField: createSpy().andCall(name => ({
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
            insertMany: createSpy().andReturn(Promise.resolve()),
            remove: createSpy(),
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

    before(async () => {
        await publishFacets(ctx, facetFields);
    });

    it('should call publishedDataset.getFacetsForField for each facet field', () => {
        expect(ctx.publishedDataset.getFacetsForField).toHaveBeenCalledWith(
            'facet1',
        );
        expect(ctx.publishedDataset.getFacetsForField).toHaveBeenCalledWith(
            'facet2',
        );
    });

    it('should call publishedFacet.remove', () => {
        expect(ctx.publishedFacet.remove).toHaveBeenCalled();
        expect(ctx.publishedFacet.remove).toHaveBeenCalledWith({
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
});
