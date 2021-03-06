import ezs from '@ezs/core';

const testOne = (stream, expectation, done) => {
    stream.pipe(
        ezs(data => {
            try {
                expectation(data);
                done();
            } catch (e) {
                done(e);
            }
        }),
    );
};

export default testOne;
