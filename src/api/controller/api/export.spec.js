import { getFacetsWithoutId } from './export';

describe('Export getFacetsWithoutId', function () {
    it('Should return an object without ID', function () {
        const facets = {
            facet1: [
                {
                    value: 'val1',
                    count: 1,
                    id: 'id1',
                },
                {
                    value: 'val2',
                    count: 2,
                    id: 'id2',
                },
            ],
            facet2: [
                {
                    value: 'val3',
                    count: 3,
                    id: 'id3',
                },
                {
                    value: 'val4',
                    count: 4,
                    id: 'id4',
                },
            ],
        };
        const facetsWithoutId = {
            facet1: ['val1', 'val2'],
            facet2: ['val3', 'val4'],
        };

        expect(getFacetsWithoutId(facets)).toEqual(facetsWithoutId);
    });

    it('Should return an empty object', function () {
        expect(getFacetsWithoutId()).toEqual({});
    });
});
