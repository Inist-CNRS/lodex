const ezs = require('../../core/src');

const testAll = (stream, expectation, done) => {
    stream.pipe(
        ezs((data, feed) => {
            if (data !== null) {
                try {
                    expectation(data);
                } catch (e) {
                    return done(e);
                }
            } else {
                return done();
            }
            return feed.end();
        }),
    );
};

exports.default = testAll;
