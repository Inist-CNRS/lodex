import expect from 'expect';

import { getUrl, parseFetchResult } from './fetchIstexData';

describe('fetchIstexData', () => {
    describe('getUrl', () => {
        it('should create istex url from given parameter', () => {
            expect(getUrl({ props: { field: { name: 'name' }, resource: { name: 'value' } }, page: 7, perPage: 5 }))
                .toEqual({
                    url: 'https://istex/?q="value"&from=35&size=5&output=id,title,publicationDate,fulltext,abstract',
                });
        });
    });

    describe('parseFetchResult', () => {
        it('should return parsed fetchResult response', () => {
            const fetchResult = {
                response: {
                    hits: [
                        {
                            data: 'value1',
                            fulltext: [
                                { extension: 'pdf', uri: 'firstUri' },
                                { extension: 'zip', uri: 'zipUri' },
                            ],
                        },
                        {
                            data: 'value2',
                            fulltext: [
                                { extension: 'zip', uri: 'zipUri' },
                                { extension: 'pdf', uri: 'secondUri' },
                            ],
                        },
                    ],
                    total: 'total',
                },
            };
            expect(parseFetchResult(fetchResult)).toEqual({
                hits: [
                    { data: 'value1', fulltext: 'firstUri' },
                    { data: 'value2', fulltext: 'secondUri' },
                ],
                total: 'total',
            });
        });

        it('should throw fetchResult.error if present', () => {
            const fetchResult = { error: new Error('Boom') };

            expect(() => parseFetchResult(fetchResult)).toThrow('Boom');
        });
    });
});
