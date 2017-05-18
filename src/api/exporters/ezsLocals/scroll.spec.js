import request from 'request';
import expect from 'expect';
import ezs from 'ezs';
import from from 'from';
import sinon from 'sinon';

/* eslint-disable-nextline */
const dataTest = require('./fixture.data.json');
const ezsLocals = require('.');

ezs.use(ezsLocals);

describe('scrollISTEX request', () => {
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

    it('should return dataset of the API', (done) => {
    /* Fake URL */
        from([{ lodex: {}, content: 'https://api-v5.istex.fr/document/?q=language:test' }])
        .pipe(ezs('scroll'))
        .pipe(
            ezs((data, feed) => {
                try {
                    expect(dataTest).toContain(data.content);
                } catch (error) {
                    return done(error);
                }

                if (data.content.noMoreScrollResults) {
                    return done();
                }
                return feed.end();
            }),
      );
    });
});
