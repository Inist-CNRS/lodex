const ezs = require('@ezs/core');
const from = require('from');

describe('tsv.ini', () => {
    it('should parse a TSV', done => {
        // @ts-expect-error TS(7034) FIXME: Variable 'res' implicitly has type 'any[]' in some... Remove this comment to see the full error message
        const res = [];
        from(['a\tb\n1\t2\n'])
            .pipe(ezs('delegate', { file: __dirname + '/tsv.ini' }))
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
