import request from 'request';
import ezs from 'ezs';
import from from 'from';
import sinon from 'sinon';
import expect from 'expect';
import testOne from './testOne';

const dataTest = require('./fixture.data.json');
const expectedJsonLd = require('./fixture.data.ld.json');
const ezsLocals = require('.');

const config = {
    istexQuery: {
        labels: '',
        linked: 'language',
        context: {
            language: 'http://purl.org/ontology/dc/language',
            doi: 'http://purl.org/ontology/bibo/doi',
        },
    },
};

ezs.use(ezsLocals);
describe('conversion to extended JSON-LD', () => {
    let sandbox;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        const s = sandbox.stub(request, 'get');
        s.onFirstCall().yields(null, { statusCode: 200 }, dataTest[0]);
        s.onSecondCall().yields(null, { statusCode: 200 }, dataTest[1]);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should return nquads from the dataset', done => {
        /* Fake URL */
        const stream = from([
            {
                lodex: { uri: 'https://lodex-uri.fr/URI' },
                content: 'https://api-v5.istex.fr/document/?q=language:test',
            },
        ])
            .pipe(ezs('scroll'))
            .pipe(ezs('convertToExtendedJsonLd', { config }));
        testOne(
            stream,
            data => {
                expect(data).toEqual(expectedJsonLd);
            },
            done,
        );
    });
});
