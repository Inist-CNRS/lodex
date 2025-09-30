// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message
import ezs from '@ezs/core';

const testOne = (stream: any, expectation: any, done: any) => {
    stream
        .pipe(ezs.catch())
        .on('data', (data: any) => {
            try {
                expectation(data);
                done();
            } catch (e) {
                done(e);
            }
        })
        .on('error', done);
};
export default testOne;
