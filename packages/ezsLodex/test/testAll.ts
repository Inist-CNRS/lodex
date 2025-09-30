// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message
import ezs from '@ezs/core';

const testAll = (stream: any, expectation: any, done: any) => {
    stream.pipe(
        ezs((data: any, feed: any) => {
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
