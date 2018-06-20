import expect from 'expect';
import ezs from 'ezs';
import from from 'from';

describe.only('csv-semicolon.ini', () => {
    it('should parse a csv', done => {
        const res = [];
        from(['a\tb\n1\t2\n'])
            .pipe(ezs.fromFile(__dirname + '/tsv.ini'))
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual([{ a: '1', b: '2' }]);
                done();
            });
    });
});
