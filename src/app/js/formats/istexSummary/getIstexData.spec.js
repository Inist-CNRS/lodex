import {
    getVolumeUrl,
    getIssueUrl,
    getDocumentUrl,
    getYearUrl,
    parseYearData,
    parseFacetData,
} from './getIstexData';

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
            ).toEqual(
                'https://api.istex.fr/document/?q=(searched.field%3A%22issn%22)&facet=publicationDate[perYear]&size=0&output=*',
            );
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
                    issn: 'issn',
                    year: 'year',
                    searchedField: 'searched.field',
                })(),
            ).toEqual({
                url:
                    'https://api.istex.fr/document/?q=(searched.field%3A%22issn%22%20AND%20publicationDate%3A%22year%22)&facet=host.volume[*-*:1]&size=0&output=*',
            });
        });
    });

    describe('parseVolumeData', () => {});

    describe('getIssueUrl', () => {
        it('should return url to get issue facet', () => {
            expect(
                getIssueUrl({
                    issn: 'issn',
                    year: 'year',
                    volume: 'volume',
                    searchedField: 'searched.field',
                })(),
            ).toEqual({
                url:
                    'https://api.istex.fr/document/?q=(searched.field%3A%22issn%22%20AND%20publicationDate%3A%22year%22%20AND%20host.volume%3A%22volume%22)&facet=host.issue[*-*:1]&size=0&output=*',
            });
        });
    });

    describe('getDocumentUrl', () => {
        it('should return url to get document', () => {
            expect(
                getDocumentUrl({
                    issn: 'issn',
                    year: 'year',
                    volume: 'volume',
                    issue: 'issue',
                    searchedField: 'searched.field',
                })(),
            ).toEqual({
                url:
                    'https://api.istex.fr/document/?q=(searched.field%3A%22issn%22%20AND%20publicationDate%3A%22year%22%20AND%20host.volume%3A%22volume%22%20AND%20host.issue%3A%22issue%22)&size=10&output=id,arkIstex,title,publicationDate,author,host.genre,host.title',
            });
        });
    });
});
