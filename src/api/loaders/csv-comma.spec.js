import ezs from 'ezs';
import from from 'from';

describe('csv-comma.ini', () => {
    it('should parse a CSV', done => {
        const res = [];
        from([`a,b\n1,2\n`])
            .pipe(ezs('delegate', { file: '/csv-comma.ini' }))
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual([{ a: '1', b: '2' }]);
                done();
            });
    });
});
