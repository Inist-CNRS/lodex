import request from 'request';
import expect from 'expect';
import ezs from 'ezs';
import from from 'from';
import sinon from 'sinon';
import exportExtendedNquads from './exportExtendedNquads';

import apiResponse from './fixture.pal.json';

describe.only('exportExtendedNquads', () => {
    let sandbox;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        const s = sandbox.stub(request, 'get');
        s.onFirstCall().yields(null, { statusCode: 200 }, apiResponse);
    });

    afterEach(() => {
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
});
