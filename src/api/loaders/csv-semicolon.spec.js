import ezs from 'ezs';
import from from 'from';

describe('csv-semicolon.ini', () => {
    it('should parse a CSV with a semicolon as separator', done => {
        const res = [];
        from(['a;b\n1;2\n'])
            .pipe(ezs('delegate', { file: '/csv-semicolon.ini' }))
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual([{ a: '1', b: '2' }]);
                done();
            });
    });
});
