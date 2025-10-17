// @ts-expect-error TS(1259): Module '"/home/madeorsk/Cloud/Marmelab/Code/lodex/... Remove this comment to see the full error message
import from from 'from';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message
import ezs from '@ezs/core';
// @ts-expect-error TS(2792): Cannot find module '../src'. Did you mean to set t... Remove this comment to see the full error message
import statements from '../src';

ezs.use(statements);

describe('flattenPatch', () => {
    it('should return when joined arrays', (done) => {
        const res: any = [];
        from([
            {
                a: 1,
                'b/0': 2,
                'b/1': 3,
                c: 4,
            },
            {
                'b/0': 1,
                'b/1': 2,
                'b/2': 3,
                'b/3': 4,
            },
            {
                d: [1, 2, 3],
            },
        ])
            .pipe(ezs('flattenPatch'))
            .on('data', (chunk: any) => {
                // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                expect(typeof chunk).toBe('object');
                res.push(chunk);
            })
            .on('end', () => {
                // @ts-expect-error TS(2339): Property 'toHaveLength' does not exist on type 'As... Remove this comment to see the full error message
                expect(res).toHaveLength(3);
                // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                expect(res[0].a).toBe(1);
                // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                expect(res[0].b).toBe('2;3');
                // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                expect(res[0].c).toBe(4);
                // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                expect(res[1].b).toBe('1;2;3;4');
                // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                expect(res[2].d).toBe('1;2;3');
                done();
            });
    });
});
