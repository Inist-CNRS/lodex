const ezs = require('@ezs/core');
const from = require('from');

describe('json.ini', () => {
    it('should parse a JSON', (done) => {
        const res: any = [];
        const expected = [{ a: '1', b: '2' }];
        from([JSON.stringify(expected)])
            .pipe(ezs('delegate', { file: __dirname + '/json.ini' }))
            .on('data', (chunk: any) => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual(expected);
                done();
            });
    });
});
