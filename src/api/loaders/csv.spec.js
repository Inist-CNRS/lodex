import ezs from 'ezs';
import from from 'from';

describe('csv.ini', () => {
    it('should parse a comma csv', done => {
        const res = [];
        from(['a,b\n1,2\n'])
            .pipe(ezs.fromFile(__dirname + '/csv.ini'))
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual([{ a: '1', b: '2' }]);
                done();
            });
    });
    it('should parse a semicolon csv', done => {
        const res = [];
        from(['a;b\n1;2\n'])
            .pipe(ezs.fromFile(__dirname + '/csv.ini'))
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual([{ a: '1', b: '2' }]);
                done();
            });
    });
});
