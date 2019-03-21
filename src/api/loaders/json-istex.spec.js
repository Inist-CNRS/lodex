import ezs from 'ezs';
import from from 'from';

describe('json-istex.ini', () => {
    it('should parse a JSON', done => {
        const res = [];
        const expected = [{ a: '1', b: '2' }];
        const input = { hits: expected };
        from([JSON.stringify(input)])
            .pipe(ezs('delegate', { file: __dirname + '/json-istex.ini' }))
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual(expected);
                done();
            });
    });
});
