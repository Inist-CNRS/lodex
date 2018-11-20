import request from 'request';
import ezs from 'ezs';
import from from 'from';

jest.mock('request', () => ({
    get: jest.fn(),
}));

const dataTest = require('./fixture.data.json');
const ezsLocals = require('.');

ezs.use(ezsLocals);

describe('scrollISTEX request', () => {
    beforeEach(() => {
        request.get
            .mockImplementationOnce((_, cb) =>
                cb(null, { statusCode: 200 }, dataTest[0]),
            )
            .mockImplementationOnce((_, cb) =>
                cb(null, { statusCode: 200 }, dataTest[1]),
            );
    });

    it('should return dataset of the API', done => {
        /* Fake URL */
        from([
            {
                lodex: {},
                content: 'https://api-v5.istex.fr/document/?q=language:test',
            },
        ])
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
