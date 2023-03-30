import from from 'from';
import ezs from '@ezs/core';
import statements from '../statements/';
import testOne from './testOne';

ezs.use(statements);
describe('conversion to extended JSON-LD', () => {
    let dataTest;
    let expectedJsonLd;
    let schemeForIstexQuery;

    beforeEach(() => {
        dataTest = [
            {
                uri: 'http://localhost:3000/ark:/67375/RZL-F4841DSB-1',
                arkIstex: 'ark:/67375/6H6-N49F7FRR-Q',
                doi: ['10.1006/jmaa.2001.7542'],
                fulltext: [
                    {
                        extension: 'pdf',
                        original: true,
                        mimetype: 'application/pdf',
                        uri:
                            'https://api.istex.fr/document/9AA9EE9B75A6067C28F8119813504932FFD3D5A1/fulltext/pdf',
                    },
                    {
                        extension: 'zip',
                        original: false,
                        mimetype: 'application/zip',
                        uri:
                            'https://api.istex.fr/document/9AA9EE9B75A6067C28F8119813504932FFD3D5A1/fulltext/zip',
                    },
                ],
            },
        ];
        expectedJsonLd = {
            '@context': {
                link: {
                    '@id': 'https://data.istex.fr/ontology/istex#subjectInist',
                    '@type': '@id',
                },
            },
            '@graph': [
                {
                    '@id': 'https://api.istex.fr/ark:/67375/6H6-N49F7FRR-Q',
                    link:
                        'http://localhost:3000/ark:/67375/RZL-F4841DSB-1',
                },
            ],
        };
        schemeForIstexQuery = 'https://data.istex.fr/ontology/istex#subjectInist';
    });

    it('should return nquads from the dataset', (done) => {
        const stream = from(dataTest).pipe(
            ezs('convertToExtendedJsonLd', { schemeForIstexQuery }),
        );
        testOne(
            stream,
            (data) => {
                expect(data).toEqual(expectedJsonLd);
            },
            done,
        );
    });

    it.skip('should expand prefixes', (done) => {
        const stream = from(dataTest)
            .pipe(ezs('convertToExtendedJsonLd', {
                linked: 'categories.inist',
                context: {
                    'categories.inist': 'fakeistex:subjectInist',
                    doi: 'fakebibo:doi',
                    'fulltext[0].uri': 'fakeistex:accessURL',
                },
                prefixes: {
                    fakebibo: 'http://purl.org/ontology/bibo/',
                    fakeistex: 'https://data.istex.fr/ontology/istex#',
                },
            }));
        testOne(
            stream,
            (data) => {
                expect(data).toEqual(expectedJsonLd);
            },
            done,
        );
    });

    it.skip('should error when prefixes are not given', (done) => {
        const stream = from(dataTest)
            .pipe(ezs('convertToExtendedJsonLd', {
                linked: 'categories.inist',
                context: {
                    'categories.inist': 'istex:subjectInist',
                    doi: 'bibo:doi',
                    'fulltext[0].uri': 'istex:accessURL',
                },
                prefixes: {
                    foo: 'bar',
                },
            }));
        const expectedErrorJsonLd = expectedJsonLd;
        expectedErrorJsonLd['@context']['categories.inist']['@id'] = 'undefinedsubjectInist';
        expectedErrorJsonLd['@context'].doi = 'undefineddoi';
        expectedErrorJsonLd['@context']['fulltext[0].uri'] = 'undefinedaccessURL';
        testOne(
            stream,
            (data) => {
                expect(data).toEqual(expectedErrorJsonLd);
            },
            done,
        );
    });

    it('should error when schemeForIstexQuery is not given', (done) => {
        const stream = from(dataTest)
            .pipe(ezs('convertToExtendedJsonLd', {
                schemeForIstexQuery: undefined,
            }));
        const expectedErrorJsonLd = expectedJsonLd;
        expectedErrorJsonLd['@context'].link = { '@id': undefined, '@type': '@id' };
        testOne(
            stream,
            (data) => {
                expect(data).toEqual(expectedErrorJsonLd);
            },
            done,
        );
    });
});
