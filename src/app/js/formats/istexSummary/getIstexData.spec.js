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
                                    { key: 'value1' },
                                    { key: 'value2' },
                                    { key: 'value3' },
                                    { key: 'value4' },
                                ],
                            },
                        },
                    },
                }),
            ).toEqual(['value1', 'value2', 'value3', 'value4']);
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
                        format: {
                            args: {
                                searchedField: 'searched.field',
                            },
                        },
                    },
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
                                { keyAsString: 2000 },
                                { keyAsString: 2010 },
                                { keyAsString: 2006 },
                                { keyAsString: 2005 },
                            ],
                        },
                    },
                }),
            ).toEqual([2000, 2005, 2006, 2010]);
        });

        it('should return empty array if empty response', () => {
            expect(parseYearData({})).toEqual([]);
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
