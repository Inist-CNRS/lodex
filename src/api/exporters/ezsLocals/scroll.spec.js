import request from 'request';
import expect from 'expect';
import ezs from 'ezs';
import from from 'from';
import sinon from 'sinon';

/* eslint-disable-nextline */
const dataTest = require('./fixture.data.json');
const ezsLocals = require('.');


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

ezs.use(ezsLocals);

describe('scrollISTEX request', () => {
    it('should return dataset of the API', (done) => {
    /* Fake URL */
        from(['https://api-v5.istex.fr/document/?q=language:test'])
      .pipe(ezs('scroll'))
      .pipe(
        ezs((data, feed) => {
            expect(dataTest).toContain(data);
            if (data.noMoreScrollResults) {
                done();
            }

            feed.end();
        }),
      );
    });
});
