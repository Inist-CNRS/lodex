import request from 'request';
import expect from 'expect';
import ezs from 'ezs';
import from from 'from';
import sinon from 'sinon';
import exportExtendedNquads from './exportExtendedNquads';

import apiPalResponse from './fixture.pal.json';
import apiCatResponse from './fixture.cat.json';

describe.only('exportExtendedNquads', () => {
    describe('single resource', () => {
        let sandbox;
        before(() => {
            sandbox = sinon.sandbox.create();
            const s = sandbox.stub(request, 'get');
            s.onFirstCall().yields(null, { statusCode: 200 }, apiPalResponse);
            s.onSecondCall().yields(null, { statusCode: 200 }, apiCatResponse[0]);
            s.onThirdCall().yields(null, { statusCode: 200 }, apiCatResponse[1]);
        });

        after(() => {
            sandbox.restore();
        });

        it('should export a single resource', (done) => {
            let outputString = '';
            exportExtendedNquads({ // config
                prefixes: {
                    bibo: 'http://purl.org/ontology/bibo/',
                    dcterms: 'http://purl.org/dc/terms/',
                    istex: 'https://data.istex.fr/ontology/istex#',
                    skos: 'http://www.w3.org/2004/02/skos/core#',
                },
                istexQuery: {
                    labels: '',
                    linked: 'language.raw',
                    context: {
                        'language.raw': 'dcterms:language',
                        link: 'skos:inScheme',
                        doi: 'bibo:doi',
                        'fulltext[0].uri': 'istex:accessURL',
                        'fulltext[1].uri': 'istex:accessURL',
                        'fulltext[2].uri': 'istex:accessURL',
                        'fulltext[3].uri': 'istex:accessURL',
                    },
                },
            }, [{ // fields
                cover: 'collection',
                scheme: 'https://data.istex.fr/ontology/istex#query',
                name: 'istexQuery',
                format: {
                    name: 'istex',
                },
            }, {
                cover: 'collection',
                scheme: 'http://purl.org/dc/terms/language',
                name: 'language',
            }],
            null, // characteristics
            from([{ // stream
                uri: 'http://uri/lang/pal',
                language: 'pal',
                istexQuery: 'language:pal',
            }]),
            ).pipe(ezs((data, feed) => {
                if (data !== null) {
                    outputString += data;
                    return feed.end();
                }
                try {
                    expect(outputString).toEqual([
                        '<https://api.istex.fr/document/08CBCE8A1AEA8857CACD7A2D47D1085BBD47F38F> <http://purl.org/dc/terms/language> <http://uri/lang/pal> .',
                        '<https://api.istex.fr/document/08CBCE8A1AEA8857CACD7A2D47D1085BBD47F38F> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://purl.org/ontology/bibo/Document> .',
                        '<https://api.istex.fr/document/08CBCE8A1AEA8857CACD7A2D47D1085BBD47F38F> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/08CBCE8A1AEA8857CACD7A2D47D1085BBD47F38F/fulltext/pdf> .',
                        '<https://api.istex.fr/document/08CBCE8A1AEA8857CACD7A2D47D1085BBD47F38F> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/08CBCE8A1AEA8857CACD7A2D47D1085BBD47F38F/fulltext/tiff> .',
                        '<https://api.istex.fr/document/08CBCE8A1AEA8857CACD7A2D47D1085BBD47F38F> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/08CBCE8A1AEA8857CACD7A2D47D1085BBD47F38F/fulltext/zip> .',
                        '<https://api.istex.fr/document/EDC4EAC977D4BEB4018117A4EF048013019F6691> <http://purl.org/dc/terms/language> <http://uri/lang/pal> .',
                        '<https://api.istex.fr/document/EDC4EAC977D4BEB4018117A4EF048013019F6691> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://purl.org/ontology/bibo/Document> .',
                        '<https://api.istex.fr/document/EDC4EAC977D4BEB4018117A4EF048013019F6691> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/EDC4EAC977D4BEB4018117A4EF048013019F6691/fulltext/pdf> .',
                        '<https://api.istex.fr/document/EDC4EAC977D4BEB4018117A4EF048013019F6691> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/EDC4EAC977D4BEB4018117A4EF048013019F6691/fulltext/tiff> .',
                        '<https://api.istex.fr/document/EDC4EAC977D4BEB4018117A4EF048013019F6691> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/EDC4EAC977D4BEB4018117A4EF048013019F6691/fulltext/zip> .',
                        '',
                    ].join('\n'));
                } catch (e) {
                    return done(e);
                }
                return done();
            }));
        });

        it('should export a single resource with multiple API responses', (done) => {
            let outputString = '';
            exportExtendedNquads({ // config
                prefixes: {
                    bibo: 'http://purl.org/ontology/bibo/',
                    dcterms: 'http://purl.org/dc/terms/',
                    istex: 'https://data.istex.fr/ontology/istex#',
                    skos: 'http://www.w3.org/2004/02/skos/core#',
                },
                istexQuery: {
                    labels: '',
                    linked: 'language.raw',
                    context: {
                        'language.raw': 'dcterms:language',
                        link: 'skos:inScheme',
                        doi: 'bibo:doi',
                        'fulltext[0].uri': 'istex:accessURL',
                        'fulltext[1].uri': 'istex:accessURL',
                        'fulltext[2].uri': 'istex:accessURL',
                        'fulltext[3].uri': 'istex:accessURL',
                        'fulltext[4].uri': 'istex:accessURL',
                        'fulltext[5].uri': 'istex:accessURL',
                    },
                },
            }, [{ // fields
                cover: 'collection',
                scheme: 'https://data.istex.fr/ontology/istex#query',
                name: 'istexQuery',
                format: {
                    name: 'istex',
                },
            }, {
                cover: 'collection',
                scheme: 'http://purl.org/dc/terms/language',
                name: 'language',
            }],
            null, // characteristics
            from([{ // stream
                uri: 'http://uri/lang/cat',
                language: 'cat',
                istexQuery: 'language:cat',
            }]),
            ).pipe(ezs((data, feed) => {
                if (data !== null) {
                    outputString += data;
                    return feed.end();
                }
                try {
                    expect(outputString).toEqual([
                        '<https://api.istex.fr/document/08B1F8C267F398D2ACC91A655391AF3B5AA3372A> <http://purl.org/dc/terms/language> <http://uri/lang/cat> .',
                        '<https://api.istex.fr/document/08B1F8C267F398D2ACC91A655391AF3B5AA3372A> <http://purl.org/ontology/bibo/doi> "10.1007/BF00230835" .',
                        '<https://api.istex.fr/document/08B1F8C267F398D2ACC91A655391AF3B5AA3372A> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://purl.org/ontology/bibo/Document> .',
                        '<https://api.istex.fr/document/08B1F8C267F398D2ACC91A655391AF3B5AA3372A> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/08B1F8C267F398D2ACC91A655391AF3B5AA3372A/fulltext/pdf> .',
                        '<https://api.istex.fr/document/08B1F8C267F398D2ACC91A655391AF3B5AA3372A> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/08B1F8C267F398D2ACC91A655391AF3B5AA3372A/fulltext/tei> .',
                        '<https://api.istex.fr/document/08B1F8C267F398D2ACC91A655391AF3B5AA3372A> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/08B1F8C267F398D2ACC91A655391AF3B5AA3372A/fulltext/txt> .',
                        '<https://api.istex.fr/document/08B1F8C267F398D2ACC91A655391AF3B5AA3372A> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/08B1F8C267F398D2ACC91A655391AF3B5AA3372A/fulltext/zip> .',
                        '<https://api.istex.fr/document/0F1BBCBBF8988CC8327F8CE7AC702D234883778C> <http://purl.org/dc/terms/language> <http://uri/lang/cat> .',
                        '<https://api.istex.fr/document/0F1BBCBBF8988CC8327F8CE7AC702D234883778C> <http://purl.org/ontology/bibo/doi> "10.1177/026553229701400304" .',
                        '<https://api.istex.fr/document/0F1BBCBBF8988CC8327F8CE7AC702D234883778C> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://purl.org/ontology/bibo/Document> .',
                        '<https://api.istex.fr/document/0F1BBCBBF8988CC8327F8CE7AC702D234883778C> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/0F1BBCBBF8988CC8327F8CE7AC702D234883778C/fulltext/pdf> .',
                        '<https://api.istex.fr/document/0F1BBCBBF8988CC8327F8CE7AC702D234883778C> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/0F1BBCBBF8988CC8327F8CE7AC702D234883778C/fulltext/tei> .',
                        '<https://api.istex.fr/document/0F1BBCBBF8988CC8327F8CE7AC702D234883778C> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/0F1BBCBBF8988CC8327F8CE7AC702D234883778C/fulltext/txt> .',
                        '<https://api.istex.fr/document/0F1BBCBBF8988CC8327F8CE7AC702D234883778C> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/0F1BBCBBF8988CC8327F8CE7AC702D234883778C/fulltext/zip> .',
                        '<https://api.istex.fr/document/80248B27E9EE110C94299848821296EFEAF9FD25> <http://purl.org/dc/terms/language> <http://uri/lang/cat> .',
                        '<https://api.istex.fr/document/80248B27E9EE110C94299848821296EFEAF9FD25> <http://purl.org/ontology/bibo/doi> "10.1108/eb011289" .',
                        '<https://api.istex.fr/document/80248B27E9EE110C94299848821296EFEAF9FD25> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://purl.org/ontology/bibo/Document> .',
                        '<https://api.istex.fr/document/80248B27E9EE110C94299848821296EFEAF9FD25> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/80248B27E9EE110C94299848821296EFEAF9FD25/fulltext/pdf> .',
                        '<https://api.istex.fr/document/80248B27E9EE110C94299848821296EFEAF9FD25> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/80248B27E9EE110C94299848821296EFEAF9FD25/fulltext/tei> .',
                        '<https://api.istex.fr/document/80248B27E9EE110C94299848821296EFEAF9FD25> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/80248B27E9EE110C94299848821296EFEAF9FD25/fulltext/txt> .',
                        '<https://api.istex.fr/document/80248B27E9EE110C94299848821296EFEAF9FD25> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/80248B27E9EE110C94299848821296EFEAF9FD25/fulltext/zip> .',
                        '<https://api.istex.fr/document/E556A1BD7269F46F245C704917450D7771665189> <http://purl.org/dc/terms/language> <http://uri/lang/cat> .',
                        '<https://api.istex.fr/document/E556A1BD7269F46F245C704917450D7771665189> <http://purl.org/ontology/bibo/doi> "10.14375/NP.9782729703268" .',
                        '<https://api.istex.fr/document/E556A1BD7269F46F245C704917450D7771665189> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://purl.org/ontology/bibo/Document> .',
                        '<https://api.istex.fr/document/E556A1BD7269F46F245C704917450D7771665189> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/E556A1BD7269F46F245C704917450D7771665189/fulltext/pdf> .',
                        '<https://api.istex.fr/document/E556A1BD7269F46F245C704917450D7771665189> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/E556A1BD7269F46F245C704917450D7771665189/fulltext/tei> .',
                        '<https://api.istex.fr/document/E556A1BD7269F46F245C704917450D7771665189> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/E556A1BD7269F46F245C704917450D7771665189/fulltext/txt> .',
                        '<https://api.istex.fr/document/E556A1BD7269F46F245C704917450D7771665189> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/E556A1BD7269F46F245C704917450D7771665189/fulltext/zip> .',
                        '',
                    ].join('\n'));
                } catch (e) {
                    return done(e);
                }
                return done();
            }));
        });
    });

    describe('two resources', () => {
        let sandbox;
        before(() => {
            sandbox = sinon.sandbox.create();
            const s = sandbox.stub(request, 'get');
            s.onFirstCall().yields(null, { statusCode: 200 }, apiPalResponse);
            s.onSecondCall().yields(null, { statusCode: 200 }, apiCatResponse[0]);
            s.onThirdCall().yields(null, { statusCode: 200 }, apiCatResponse[1]);
        });

        after(() => {
            sandbox.restore();
        });

        it('should export a two resources', (done) => {
            let outputString = '';
            exportExtendedNquads({ // config
                prefixes: {
                    bibo: 'http://purl.org/ontology/bibo/',
                    dcterms: 'http://purl.org/dc/terms/',
                    istex: 'https://data.istex.fr/ontology/istex#',
                    skos: 'http://www.w3.org/2004/02/skos/core#',
                },
                istexQuery: {
                    labels: '',
                    linked: 'language.raw',
                    context: {
                        'language.raw': 'dcterms:language',
                        link: 'skos:inScheme',
                        doi: 'bibo:doi',
                        'fulltext[0].uri': 'istex:accessURL',
                        'fulltext[1].uri': 'istex:accessURL',
                        'fulltext[2].uri': 'istex:accessURL',
                        'fulltext[3].uri': 'istex:accessURL',
                        'fulltext[4].uri': 'istex:accessURL',
                        'fulltext[5].uri': 'istex:accessURL',
                    },
                },
            }, [{ // fields
                cover: 'collection',
                scheme: 'https://data.istex.fr/ontology/istex#query',
                name: 'istexQuery',
                format: {
                    name: 'istex',
                },
            }, {
                cover: 'collection',
                scheme: 'http://purl.org/dc/terms/language',
                name: 'language',
            }],
            null, // characteristics
            from([{ // stream
                uri: 'http://uri/lang/pal',
                language: 'pal',
                istexQuery: 'language:pal',
            }, {
                uri: 'http://uri/lang/cat',
                language: 'cat',
                istexQuery: 'language:cat',
            }]),
            ).pipe(ezs((data, feed) => {
                if (data !== null) {
                    outputString += data;
                    return feed.end();
                }
                try {
                    expect(outputString).toEqual([
                        '<https://api.istex.fr/document/08CBCE8A1AEA8857CACD7A2D47D1085BBD47F38F> <http://purl.org/dc/terms/language> <http://uri/lang/pal> .',
                        '<https://api.istex.fr/document/08CBCE8A1AEA8857CACD7A2D47D1085BBD47F38F> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://purl.org/ontology/bibo/Document> .',
                        '<https://api.istex.fr/document/08CBCE8A1AEA8857CACD7A2D47D1085BBD47F38F> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/08CBCE8A1AEA8857CACD7A2D47D1085BBD47F38F/fulltext/pdf> .',
                        '<https://api.istex.fr/document/08CBCE8A1AEA8857CACD7A2D47D1085BBD47F38F> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/08CBCE8A1AEA8857CACD7A2D47D1085BBD47F38F/fulltext/tiff> .',
                        '<https://api.istex.fr/document/08CBCE8A1AEA8857CACD7A2D47D1085BBD47F38F> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/08CBCE8A1AEA8857CACD7A2D47D1085BBD47F38F/fulltext/zip> .',
                        '<https://api.istex.fr/document/EDC4EAC977D4BEB4018117A4EF048013019F6691> <http://purl.org/dc/terms/language> <http://uri/lang/pal> .',
                        '<https://api.istex.fr/document/EDC4EAC977D4BEB4018117A4EF048013019F6691> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://purl.org/ontology/bibo/Document> .',
                        '<https://api.istex.fr/document/EDC4EAC977D4BEB4018117A4EF048013019F6691> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/EDC4EAC977D4BEB4018117A4EF048013019F6691/fulltext/pdf> .',
                        '<https://api.istex.fr/document/EDC4EAC977D4BEB4018117A4EF048013019F6691> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/EDC4EAC977D4BEB4018117A4EF048013019F6691/fulltext/tiff> .',
                        '<https://api.istex.fr/document/EDC4EAC977D4BEB4018117A4EF048013019F6691> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/EDC4EAC977D4BEB4018117A4EF048013019F6691/fulltext/zip> .',
                        '<https://api.istex.fr/document/08B1F8C267F398D2ACC91A655391AF3B5AA3372A> <http://purl.org/dc/terms/language> <http://uri/lang/cat> .',
                        '<https://api.istex.fr/document/08B1F8C267F398D2ACC91A655391AF3B5AA3372A> <http://purl.org/ontology/bibo/doi> "10.1007/BF00230835" .',
                        '<https://api.istex.fr/document/08B1F8C267F398D2ACC91A655391AF3B5AA3372A> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://purl.org/ontology/bibo/Document> .',
                        '<https://api.istex.fr/document/08B1F8C267F398D2ACC91A655391AF3B5AA3372A> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/08B1F8C267F398D2ACC91A655391AF3B5AA3372A/fulltext/pdf> .',
                        '<https://api.istex.fr/document/08B1F8C267F398D2ACC91A655391AF3B5AA3372A> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/08B1F8C267F398D2ACC91A655391AF3B5AA3372A/fulltext/tei> .',
                        '<https://api.istex.fr/document/08B1F8C267F398D2ACC91A655391AF3B5AA3372A> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/08B1F8C267F398D2ACC91A655391AF3B5AA3372A/fulltext/txt> .',
                        '<https://api.istex.fr/document/08B1F8C267F398D2ACC91A655391AF3B5AA3372A> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/08B1F8C267F398D2ACC91A655391AF3B5AA3372A/fulltext/zip> .',
                        '<https://api.istex.fr/document/0F1BBCBBF8988CC8327F8CE7AC702D234883778C> <http://purl.org/dc/terms/language> <http://uri/lang/cat> .',
                        '<https://api.istex.fr/document/0F1BBCBBF8988CC8327F8CE7AC702D234883778C> <http://purl.org/ontology/bibo/doi> "10.1177/026553229701400304" .',
                        '<https://api.istex.fr/document/0F1BBCBBF8988CC8327F8CE7AC702D234883778C> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://purl.org/ontology/bibo/Document> .',
                        '<https://api.istex.fr/document/0F1BBCBBF8988CC8327F8CE7AC702D234883778C> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/0F1BBCBBF8988CC8327F8CE7AC702D234883778C/fulltext/pdf> .',
                        '<https://api.istex.fr/document/0F1BBCBBF8988CC8327F8CE7AC702D234883778C> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/0F1BBCBBF8988CC8327F8CE7AC702D234883778C/fulltext/tei> .',
                        '<https://api.istex.fr/document/0F1BBCBBF8988CC8327F8CE7AC702D234883778C> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/0F1BBCBBF8988CC8327F8CE7AC702D234883778C/fulltext/txt> .',
                        '<https://api.istex.fr/document/0F1BBCBBF8988CC8327F8CE7AC702D234883778C> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/0F1BBCBBF8988CC8327F8CE7AC702D234883778C/fulltext/zip> .',
                        '<https://api.istex.fr/document/80248B27E9EE110C94299848821296EFEAF9FD25> <http://purl.org/dc/terms/language> <http://uri/lang/cat> .',
                        '<https://api.istex.fr/document/80248B27E9EE110C94299848821296EFEAF9FD25> <http://purl.org/ontology/bibo/doi> "10.1108/eb011289" .',
                        '<https://api.istex.fr/document/80248B27E9EE110C94299848821296EFEAF9FD25> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://purl.org/ontology/bibo/Document> .',
                        '<https://api.istex.fr/document/80248B27E9EE110C94299848821296EFEAF9FD25> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/80248B27E9EE110C94299848821296EFEAF9FD25/fulltext/pdf> .',
                        '<https://api.istex.fr/document/80248B27E9EE110C94299848821296EFEAF9FD25> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/80248B27E9EE110C94299848821296EFEAF9FD25/fulltext/tei> .',
                        '<https://api.istex.fr/document/80248B27E9EE110C94299848821296EFEAF9FD25> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/80248B27E9EE110C94299848821296EFEAF9FD25/fulltext/txt> .',
                        '<https://api.istex.fr/document/80248B27E9EE110C94299848821296EFEAF9FD25> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/80248B27E9EE110C94299848821296EFEAF9FD25/fulltext/zip> .',
                        '<https://api.istex.fr/document/E556A1BD7269F46F245C704917450D7771665189> <http://purl.org/dc/terms/language> <http://uri/lang/cat> .',
                        '<https://api.istex.fr/document/E556A1BD7269F46F245C704917450D7771665189> <http://purl.org/ontology/bibo/doi> "10.14375/NP.9782729703268" .',
                        '<https://api.istex.fr/document/E556A1BD7269F46F245C704917450D7771665189> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://purl.org/ontology/bibo/Document> .',
                        '<https://api.istex.fr/document/E556A1BD7269F46F245C704917450D7771665189> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/E556A1BD7269F46F245C704917450D7771665189/fulltext/pdf> .',
                        '<https://api.istex.fr/document/E556A1BD7269F46F245C704917450D7771665189> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/E556A1BD7269F46F245C704917450D7771665189/fulltext/tei> .',
                        '<https://api.istex.fr/document/E556A1BD7269F46F245C704917450D7771665189> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/E556A1BD7269F46F245C704917450D7771665189/fulltext/txt> .',
                        '<https://api.istex.fr/document/E556A1BD7269F46F245C704917450D7771665189> <https://data.istex.fr/ontology/istex#accessURL> <https://api.istex.fr/document/E556A1BD7269F46F245C704917450D7771665189/fulltext/zip> .',
                        '',
                    ].join('\n'));
                } catch (e) {
                    return done(e);
                }
                return done();
            }));
        });
    });
});
