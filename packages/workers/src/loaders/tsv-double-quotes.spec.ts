import from from 'from';
// @ts-expect-error TS7016
import ezs from '@ezs/core';

describe('tsv-double-quotes.ini', () => {
    it('should parse a TSV with double quotes escaping', (done) => {
        const res: any = [];
        from(['a\tb\n', '"1\t2"\t3\n'])
            .pipe(
                ezs('delegate', { file: __dirname + '/tsv-double-quotes.ini' }),
            )
            .on('data', (chunk: any) => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toMatchObject([{ a: '1\t2', b: '3' }]);
                done();
            });
    });
});
