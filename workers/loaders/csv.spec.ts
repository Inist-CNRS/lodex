const ezs = require('@ezs/core');
const from = require('from');

describe('csv.ini', () => {
    it('should parse a comma csv', (done) => {
        const res: any = [];
        from(['a,b\n1,2\n'])
            .pipe(ezs('delegate', { file: __dirname + '/csv.ini' }))
            .on('data', (chunk: any) => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual([{ a: '1', b: '2' }]);
                done();
            });
    });
    it('should parse a semicolon csv', (done) => {
        const res: any = [];
        from(['a;b\n1;2\n'])
            .pipe(ezs('delegate', { file: __dirname + '/csv.ini' }))
            .on('data', (chunk: any) => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual([{ a: '1', b: '2' }]);
                done();
            });
    });
});
