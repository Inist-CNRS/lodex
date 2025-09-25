import from from 'from';
import ezs from '@ezs/core';
import statements from '../src';

ezs.use(statements);

describe('flattenPatch', () => {
    it('should return when joined arrays', (done) => {
        const res = [];
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
            .on('data', (chunk) => {
                expect(typeof chunk).toBe('object');
                res.push(chunk);
            })
            .on('end', () => {
                expect(res.length).toBe(3);
                expect(res[0].a).toBe(1);
                expect(res[0].b).toBe('2;3');
                expect(res[0].c).toBe(4);
                expect(res[1].b).toBe('1;2;3;4');
                expect(res[2].d).toBe('1;2;3');
                done();
            });
    });
});
