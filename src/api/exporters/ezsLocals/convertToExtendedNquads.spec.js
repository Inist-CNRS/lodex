import request from 'request';
import expect from 'expect';
import ezs from 'ezs';
import from from 'from';
import sinon from 'sinon';
import fs from 'fs';

/* eslint-disable-nextline */
const dataTest = require('./fixture.data.json');
const ezsLocals = require('.');

ezs.use(ezsLocals);
describe('conversion to extended Nquads', () => {
    let sandbox;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        const s = sandbox.stub(request, 'get');
        s.onFirstCall().yields(null, null, dataTest[0]);
        s.onSecondCall().yields(null, null, dataTest[1]);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should return nquads from the dataset', (done) => {
    /* should result of the nquads conversion */
        const dataNquads = fs.readFileSync(`${__dirname}/fixture.data.nq`, 'utf8');

    /* Fake URL */
        from(['https://api-v5.istex.fr/document/?q=language:test'])
        .pipe(ezs('scroll'))
        .pipe(ezs('convertToExtendedNquads', { graph: 'http://test-unit.fr' }))
        .pipe(ezs((data, feed) => {
            if (data === null) {
                done();
            }
            expect(dataNquads).toContain(JSON.stringify(data));
            feed.end();
        }),
      );
    });
});
