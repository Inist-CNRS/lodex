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
                    'language.raw': 'language',
                    link: 'skos:inScheme',
                    doi: 'bibo:doi',
                    'fulltext[0].uri': 'istex:accessURL',
                },
            },
        }, [{ // fields
            cover: 'collection',
            scheme: 'https://data.istex.fr/ontology/istex#query',
            name: 'istexQuery',
        }, {
            cover: 'collection',
            scheme: 'http://purl.org/dc/terms/language',
            name: 'language',
        }],
        null, // characteristics
        from([{ // stream
            uri: 'http://uri/1',
            language: 'pal',
            istexQuery: 'language:pal',
        }]),
        ).pipe(ezs((data, feed) => {
            if (data !== null) {
                outputString += data;
            } else {
                try {
                    expect(outputString).toEqual('\n');
                } catch (e) {
                    return done(e);
                }
                return done();
            }
            return feed.end();
        }));
    });
});
