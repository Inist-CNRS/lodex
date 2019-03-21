import ezs from 'ezs';
import from from 'from';

describe('json.ini', () => {
    it('should parse a JSON', done => {
        const res = [];
        const expected = [{ a: '1', b: '2' }];
        from([JSON.stringify(expected)])
            .pipe(ezs('delegate', { file: __dirname + '/json.ini' }))
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual(expected);
                done();
            });
    });
});
