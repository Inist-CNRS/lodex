import ezs from 'ezs';
import from from 'from';

describe('tsv-double-quotes.ini', () => {
    it('should parse a TSV with double quotes escaping', done => {
        const res = [];
        from(['a\tb\n', '"1\t2"\t3\n'])
            .pipe(ezs('delegate', { file: '/tsv-double-quotes.ini' }))
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual([{ a: '1\t2', b: '3' }]);
                done();
            });
    });
});
