// @ts-expect-error TS(1259): Module '"/home/madeorsk/Cloud/Marmelab/Code/lodex/... Remove this comment to see the full error message
import from from 'from';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message
import ezs from '@ezs/core';
// @ts-expect-error TS(2792): Cannot find module '../src'. Did you mean to set t... Remove this comment to see the full error message
import ezsLodex from '../src';

ezs.use(ezsLodex);

describe('filterVersions', () => {
    it('should return the last chunk of a stream', (done) => {
        from([1, 2, 3])
            .pipe(ezs('getLastCharacteristic'))
            .on('data', (data: any) => {
                // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                expect(data).toBe(3);
            })
            .on('end', () => {
                done();
            })
            .on('error', done);
    });
});
