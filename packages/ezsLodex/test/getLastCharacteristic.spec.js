import from from 'from';
import ezs from '@ezs/core';
import ezsLodex from '../src';

ezs.use(ezsLodex);

describe('filterVersions', () => {
    it('should return the last chunk of a stream', (done) => {
        from([1, 2, 3])
            .pipe(ezs('getLastCharacteristic'))
            .on('data', (data) => {
                expect(data).toBe(3);
            })
            .on('end', () => {
                done();
            })
            .on('error', done);
    });
});
