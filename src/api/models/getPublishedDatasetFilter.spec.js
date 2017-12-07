import expect from 'expect';

import {
    addFacetToFilters,
    addMatchToFilters,
    addKeyToFilters,
    getValueQueryFragment,
} from './getPublishedDatasetFilter';

describe('getPublishedDatasetFilter', () => {
    describe('addFacetToFilters', () => {
        it('should add facet to filters', () => {
            const facets = {
                facet: 'value',
                otherFacet: 'other value',
            };
            const facetNames = ['facet', 'otherFacet'];
            expect(
                addFacetToFilters(facets, facetNames)({
                    filter: 'data',
                }),
            ).toEqual({
                filter: 'data',
                $and: [
                    { 'versions.facet': 'value' },
                    { 'versions.otherFacet': 'other value' },
                ],
            });
        });

        it('should add single facet in array to filters', () => {
            const facets = {
                facet: ['value'],
                otherFacet: ['other value'],
            };
            const facetNames = ['facet', 'otherFacet'];
            expect(
                addFacetToFilters(facets, facetNames)({
                    filter: 'data',
                }),
            ).toEqual({
                filter: 'data',
                $and: [
                    { 'versions.facet': 'value' },
                    { 'versions.otherFacet': 'other value' },
                ],
            });
        });

        it('should add multiple facet to filters', () => {
            const facets = {
                facet: ['value', 'other value'],
            };
            const facetNames = ['facet', 'otherFacet'];
            expect(
                addFacetToFilters(facets, facetNames)({
                    filter: 'data',
                }),
            ).toEqual({
                filter: 'data',
                $and: [
                    {
                        $or: [
                            { 'versions.facet': 'value' },
                            { 'versions.facet': 'other value' },
                        ],
                    },
                ],
            });
        });

        it('should ignore facet not in facetNames', () => {
            const facets = {
                facet: 'value',
                otherFacet: 'other value',
            };
            const facetNames = ['otherFacet'];
            expect(
                addFacetToFilters(facets, facetNames)({
                    filter: 'data',
                }),
            ).toEqual({
                filter: 'data',
                $and: [{ 'versions.otherFacet': 'other value' }],
            });
        });

        it('should return filters if no facets', () => {
            const facets = null;
            const facetNames = ['facet', 'otherFacet'];
            expect(
                addFacetToFilters(facets, facetNames)({
                    filter: 'data',
                }),
            ).toEqual({
                filter: 'data',
            });
        });

        it('should return filters if no facets names', () => {
            const facets = {
                facet: 'value',
                otherFacet: 'other value',
            };
            const facetNames = null;
            expect(
                addFacetToFilters(facets, facetNames)({
                    filter: 'data',
                }),
            ).toEqual({
                filter: 'data',
            });
        });
    });

    describe('getValueQueryFragment', () => {
        it('should return query fragment for fieldName with value', () => {
            expect(getValueQueryFragment('fieldName', 'value', false)).toEqual({
                'versions.fieldName': 'value',
            });
        });

        it('should return query fragment for filedName not with value if inverted is true', () => {
            expect(getValueQueryFragment('fieldName', 'value', true)).toEqual({
                'versions.fieldName': { $ne: 'value' },
            });
        });

        it('should return query fragment for fieldName with [value]', () => {
            expect(
                getValueQueryFragment('fieldName', ['value'], false),
            ).toEqual({
                'versions.fieldName': 'value',
            });
        });

        it('should return query fragment for filedName not with value if inverted is true', () => {
            expect(getValueQueryFragment('fieldName', ['value'], true)).toEqual(
                {
                    'versions.fieldName': { $ne: 'value' },
                },
            );
        });

        it('should return query fragment for fieldName with value1 or value2', () => {
            expect(
                getValueQueryFragment('fieldName', ['value1', 'value2'], false),
            ).toEqual({
                $or: [
                    { 'versions.fieldName': 'value1' },
                    { 'versions.fieldName': 'value2' },
                ],
            });
        });

        it('should return query fragment for filedName not with value if inverted is true', () => {
            expect(
                getValueQueryFragment('fieldName', ['value1', 'value2'], true),
            ).toEqual({
                $nor: [
                    { 'versions.fieldName': 'value1' },
                    { 'versions.fieldName': 'value2' },
                ],
            });
        });
    });

    describe('addMatchToFilters', () => {
        it('should add match for each searchablefields to filters', () => {
            const match = 'match';
            const searchableFields = ['field1', 'field2'];
            expect(
                addMatchToFilters(match, searchableFields)({ filter: 'data' }),
            ).toEqual({
                filter: 'data',
                $or: [
                    { 'versions.field1': { $regex: /match/, $options: 'i' } },
                    { 'versions.field2': { $regex: /match/, $options: 'i' } },
                ],
            });
        });

        it('should return filters if no match', () => {
            const match = null;
            const searchableFields = ['field1', 'field2'];
            expect(
                addMatchToFilters(match, searchableFields)({ filter: 'data' }),
            ).toEqual({
                filter: 'data',
            });
        });

        it('should return filters if no searchableFields', () => {
            const match = 'match';
            const searchableFields = null;
            expect(
                addMatchToFilters(match, searchableFields)({ filter: 'data' }),
            ).toEqual({
                filter: 'data',
            });
        });
    });

    describe('addKeyToFilters', () => {
        it('should add value at key to filters', () => {
            expect(
                addKeyToFilters('key', 'value')({
                    filter: 'data',
                }),
            ).toEqual({
                filter: 'data',
                key: 'value',
            });
        });
        it('should return filters if no values', () => {
            expect(
                addKeyToFilters('key', null)({
                    filter: 'data',
                }),
            ).toEqual({
                filter: 'data',
            });
        });
    });
});
