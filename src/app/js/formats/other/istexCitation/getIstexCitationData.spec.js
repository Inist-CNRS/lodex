import {
    getCitationDocumentUrl,
    getCitationUrl,
    parseCitationData,
} from './getIstexCitationData';

import { CUSTOM_ISTEX_QUERY } from '../istexSummary/constants';

describe('getIstexCitationData', () => {
    describe('getCitationUrl', () => {
        it('should return url to get citation facet', () => {
            expect(
                getCitationUrl({
                    resource: {
                        value: 'refBibs.host.title:"The Lancet"',
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

            const result = getCitationUrl({
                resource: { value: query },
                field: { name: 'value' },
                searchedField: CUSTOM_ISTEX_QUERY,
            });

            expect(result).toMatchSnapshot();
        });
    });

    describe('parseCitationData', () => {
        it('should extract journal name from data', () => {
            expect(
                parseCitationData({
                    aggregations: {
                        'host.title': {
                            buckets: [
                                { key: 'The Lancet', docCount: 9908 },
                                {
                                    key: 'Social Science & Medicine',
                                    docCount: 322,
                                },
                                {
                                    key: 'Behavioral and Brain Sciences',
                                    docCount: 178,
                                },
                                {
                                    key: 'Health Policy and Planning',
                                    docCount: 113,
                                },
                            ],
                        },
                    },
                }),
            ).toEqual({
                hits: [
                    { name: 'The Lancet', count: 9908 },
                    {
                        name: 'Social Science & Medicine',
                        count: 322,
                    },
                    {
                        name: 'Behavioral and Brain Sciences',
                        count: 178,
                    },
                    {
                        name: 'Health Policy and Planning',
                        count: 113,
                    },
                ],
            });
        });

        it('should return empty array if empty response', () => {
            expect(parseCitationData({})).toEqual({ hits: [] });
        });
    });

    describe('getCitationDocumentUrl', () => {
        it('should return url to get document', () => {
            expect(
                getCitationDocumentUrl({
                    value: 'refBibs.host.title:"The Lancet"',
                    name: 'journal',
                    searchedField: 'searched.field',
                    documentSortBy: 'publicationDate[desc]',
                })(),
            ).toMatchSnapshot();
        });
    });
});
