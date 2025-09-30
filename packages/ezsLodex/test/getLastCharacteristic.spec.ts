import from from 'from';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message
import ezs from '@ezs/core';
import ezsLodex from '../src';

ezs.use(ezsLodex);

describe('filterVersions', () => {
    it('should return the last chunk of a stream', (done: any) => {
        from([1, 2, 3])
            .pipe(ezs('getLastCharacteristic'))
            .on('data', (data: any) => {
                expect(data).toBe(3);
            })
            .on('end', () => {
                done();
            })
            .on('error', done);
    });
});
