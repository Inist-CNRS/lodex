const ezs = require('@ezs/core');
const from = require('from');

describe('csv-semicolon.ini', () => {
    it('should parse a CSV with a semicolon as separator', (done) => {
        const res: any = [];
        from(['a;b\n1;2\n'])
            .pipe(ezs('delegate', { file: __dirname + '/csv-semicolon.ini' }))
            .on('data', (chunk: any) => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual([{ a: '1', b: '2' }]);
                done();
            });
    });
});
