/* eslint max-len: off */
import expect, { createSpy } from 'expect';
import publishFacets from './publishFacets';

describe('publishFacets', () => {
    const ctx = {
        publishedDataset: {
            findDistinctValuesForField: createSpy().andReturn(Promise.resolve(['value1', 'value2'])),
            countByFacet: createSpy().andReturn(Promise.resolve(100)),
        },
        publishedFacet: {
            insertFacet: createSpy().andReturn(Promise.resolve()),
        },
    };
    const facetFields = [{
        name: 'facet1',
        isFacet: true,
    }, {
        name: 'facet2',
        isFacet: true,
    }, {
        name: 'field2',
    }];

    before(async () => {
        await publishFacets(ctx, facetFields);
    });

    it('should call publishedDataset.findDistinctValuesForField for each facet field', () => {
        expect(ctx.publishedDataset.findDistinctValuesForField).toHaveBeenCalledWith('facet1');
        expect(ctx.publishedDataset.findDistinctValuesForField).toHaveBeenCalledWith('facet2');
    });

    it('should call ctx.publishedFacet.insertFacet for each facet field with their distinct values', () => {
        expect(ctx.publishedFacet.insertFacet).toHaveBeenCalledWith('facet1', [{ value: 'value1', count: 100 }, { value: 'value2', count: 100 }]);
        expect(ctx.publishedFacet.insertFacet).toHaveBeenCalledWith('facet2', [{ value: 'value1', count: 100 }, { value: 'value2', count: 100 }]);
    });
});
