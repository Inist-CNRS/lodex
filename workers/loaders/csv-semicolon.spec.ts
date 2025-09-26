const ezs = require('@ezs/core');
const from = require('from');

describe('csv-semicolon.ini', () => {
    it('should parse a CSV with a semicolon as separator', done => {
        // @ts-expect-error TS(7034) FIXME: Variable 'res' implicitly has type 'any[]' in some... Remove this comment to see the full error message
        const res = [];
        from(['a;b\n1;2\n'])
            .pipe(ezs('delegate', { file: __dirname + '/csv-semicolon.ini' }))
            // @ts-expect-error TS(7006) FIXME: Parameter 'chunk' implicitly has an 'any' type.
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                // @ts-expect-error TS(2304) FIXME: Cannot find name 'expect'.
                expect(res).toEqual([{ a: '1', b: '2' }]);
                done();
            });
    });
});
