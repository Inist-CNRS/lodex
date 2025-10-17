import from from 'from';
// @ts-expect-error TS7016
import ezs from '@ezs/core';

describe('tsv.ini', () => {
    it('should parse a TSV', (done) => {
        const res: any = [];
        from(['a\tb\n1\t2\n'])
            .pipe(ezs('delegate', { file: __dirname + '/tsv.ini' }))
            .on('data', (chunk: any) => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toMatchObject([{ a: '1', b: '2' }]);
                done();
            });
    });
});
