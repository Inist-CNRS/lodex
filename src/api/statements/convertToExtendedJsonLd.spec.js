import path from 'path';
import fs from 'fs';
import request from 'request';
import ezs from 'ezs';
import from from 'from';
import sinon from 'sinon';
import { expect } from 'chai';
import testAll from './testAll';

const dataTest = require('./fixture.data.json');
const dataNquads = fs.readFileSync(
    path.resolve(__dirname, './fixture.data.nq'),
    'utf8',
);
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
describe('conversion to extended Nquads', () => {
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
        testAll(
            stream,
            data => {
                const lines = data.split('\n');
                expect(dataNquads.includes(lines[0]));
                expect(dataNquads.includes(lines[1]));
                expect(dataNquads.includes(lines[2]));
                expect(dataNquads.includes(lines[3]));
                expect(dataNquads.includes(lines[4]));
                expect(dataNquads.includes(lines[5]));
                expect(dataNquads.includes(lines[6]));
            },
            done,
        );
    });
});
