import request from 'request';
import expect from 'expect';
import ezs from 'ezs';
import from from 'from';
import sinon from 'sinon';
import fs from 'fs';
import assert from 'assert';

/* eslint-disable-nextline */
const dataTest = require('./fixture.data.json');
const ezsLocals = require('.');

const config = {
    istexQuery: {
        labels: '',
        context: {
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

    it('should return nquads from the dataset', (done) => {
    /* should result of the nquads conversion */
        // const dataNquads = fs.readFileSync(`${__dirname}/fixture.data.nq`, 'utf8');
        const dataNquads = fs.readFileSync('test.txt', 'utf8');
        let buffData;
    /* Fake URL */
        from(['https://api-v5.istex.fr/document/?q=language:test'])
        .pipe(ezs('scroll'))
        .pipe(ezs('convertToExtendedNquads', { graph: 'http://test-unit.fr', config }))
        // .pipe(fs.createWriteStream('test.txt'));
        .pipe(ezs((data, feed) => {
            if (data === null) {
                console.log(dataNquads === buffData);
                if (dataNquads !== buffData) {
                    return done(new Error('jdshfgjksh'));
                }
                // assert(dataNquads === buffData);
                // assert.equal(dataNquads, buffData);
                // expect(dataNquads).toEqual(buffData);
                return done();
            }
            buffData += data;
            // expect(dataNquads).toContain(data);
            return feed.end();
        }));
    });
});
