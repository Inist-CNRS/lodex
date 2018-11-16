import {
    getVolumeUrl,
    getIssueUrl,
    getDocumentUrl,
    getYearUrl,
    parseYearData,
    parseFacetData,
    getOtherVolumeUrl,
    getOtherIssueUrl,
    parseOtherData,
} from './getIstexData';

import { CUSTOM_ISTEX_QUERY } from './constants';

describe('getIstexData', () => {
    describe('parseFacetData', () => {
        it('should retrieve facet key for given facet name', () => {
            expect(
                parseFacetData('facet.name')({
                    response: {
                        aggregations: {
                            'facet.name': {
                                buckets: [
                                    { key: 'value1', docCount: 1 },
                                    { key: 'value2', docCount: 2 },
                                    { key: 'value3', docCount: 3 },
                                    { key: 'value4', docCount: 4 },
                                ],
                            },
                        },
                    },
                }),
            ).toEqual({
                hits: [
                    { name: 'value1', count: 1 },
                    { name: 'value2', count: 2 },
                    { name: 'value3', count: 3 },
                    { name: 'value4', count: 4 },
                ],
            });
        });
    });

    describe('getYearUrl', () => {
        it('should return url to get year facet', () => {
            expect(
                getYearUrl({
                    resource: {
                        value: 'issn',
                    },
                    field: {
                        name: 'value',
                    },
                    searchedField: 'searched.field',
                }),
            ).toMatchSnapshot();
        });

        it('should return the value if the custom ISTEX query is selected', () => {
            const query = 'CUSTOM_QUERY';

            const result = getYearUrl({
                resource: { value: query },
                field: { name: 'value' },
                searchedField: CUSTOM_ISTEX_QUERY,
            });

            expect(result).toMatchSnapshot();
        });
    });

    describe('parseYearData', () => {
        it('should extract year from data', () => {
            expect(
                parseYearData({
                    aggregations: {
                        publicationDate: {
                            buckets: [
                                { keyAsString: 2000, docCount: 1 },
                                { keyAsString: 2010, docCount: 2 },
                                { keyAsString: 2006, docCount: 3 },
                                { keyAsString: 2005, docCount: 4 },
                            ],
                        },
                    },
                }),
            ).toEqual({
                hits: [
                    { name: 2010, count: 2 },
                    { name: 2006, count: 3 },
                    { name: 2005, count: 4 },
                    { name: 2000, count: 1 },
                ],
            });
        });

        it('should extract year from data', () => {
            expect(
                parseYearData(
                    {
                        aggregations: {
                            publicationDate: {
                                buckets: [
                                    { keyAsString: 2000, docCount: 1 },
                                    { keyAsString: 2010, docCount: 2 },
                                    { keyAsString: 2006, docCount: 3 },
                                    { keyAsString: 2005, docCount: 4 },
                                ],
                            },
                        },
                    },
                    'YEAR_ASC',
                ),
            ).toEqual({
                hits: [
                    { name: 2000, count: 1 },
                    { name: 2005, count: 4 },
                    { name: 2006, count: 3 },
                    { name: 2010, count: 2 },
                ],
            });
        });

        it('should return empty array if empty response', () => {
            expect(parseYearData({})).toEqual({ hits: [] });
        });
    });

    describe('getVolumeUrl', () => {
        it('should return url to get volume facet', () => {
            expect(
                getVolumeUrl({
                    value: 'issn',
                    year: 'year',
                    searchedField: 'searched.field',
                })(),
            ).toMatchSnapshot();
        });
    });

    describe('getIssueUrl', () => {
        it('should return url to get issue facet', () => {
            expect(
                getIssueUrl({
                    value: 'issn',
                    year: 'year',
                    volume: 'volume',
                    searchedField: 'searched.field',
                })(),
            ).toMatchSnapshot();
        });

        it('should return url to get issue facet with other volume retrieving all non numerical volume', () => {
            expect(
                getIssueUrl({
                    value: 'issn',
                    year: 'year',
                    volume: 'other',
                    searchedField: 'searched.field',
                })(),
            ).toMatchSnapshot();
        });
    });

    describe('getDocumentUrl', () => {
        it('should return url to get document', () => {
            expect(
                getDocumentUrl({
                    value: 'issn',
                    year: 'year',
                    volume: 'volume',
                    issue: 'issue',
                    searchedField: 'searched.field',
                    documentSortBy: 'title.raw',
                })(),
            ).toMatchSnapshot();
        });

        it('should return url to get document with other volume retrieving all non numerical volume', () => {
            expect(
                getDocumentUrl({
                    value: 'issn',
                    year: 'year',
                    volume: 'other',
                    issue: 'issue',
                    searchedField: 'searched.field',
                    documentSortBy: 'title.raw',
                })(),
            ).toMatchSnapshot();
        });

        it('should return url to get document with other issue retrieving all non numerical issue', () => {
            expect(
                getDocumentUrl({
                    value: 'issn',
                    year: 'year',
                    volume: 'volume',
                    issue: 'other',
                    searchedField: 'searched.field',
                    documentSortBy: 'title.raw',
                })(),
            ).toMatchSnapshot();
        });
    });

    describe('getOtherVolumeUrl', () => {
        it('should return url to get non numerical volumes', () => {
            expect(
                getOtherVolumeUrl({
                    value: 'issn',
                    year: 'year',
                    volume: 'volume',
                    searchedField: 'searched.field',
                })(),
            ).toMatchSnapshot();
        });
    });

    describe('getOtherIssueUrl', () => {
        it('should return url to get non numerical issues', () => {
            expect(
                getOtherIssueUrl({
                    value: 'issn',
                    year: 'year',
                    volume: 'volume',
                    issue: 'issue',
                    searchedField: 'searched.field',
                })(),
            ).toMatchSnapshot();
        });
    });

    describe('parseOtherData', () => {
        it('should retrieve total of response and assign it to ther result', () => {
            expect(
                parseOtherData({
                    response: {
                        total: 19,
                    },
                }),
            ).toEqual({ name: 'other', count: 19 });
        });
    });
});
