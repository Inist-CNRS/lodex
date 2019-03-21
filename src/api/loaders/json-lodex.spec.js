import ezs from 'ezs';
import from from 'from';

describe('json-lodex.ini', () => {
    it('should parse a JSON', done => {
        const res = [];
        const expected = [{ a: '1', b: '2' }];
        const input = { data: expected };
        from([JSON.stringify(input)])
            .pipe(ezs('delegate', { file: '/json-lodex.ini' }))
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual(expected);
                done();
            });
    });
});
