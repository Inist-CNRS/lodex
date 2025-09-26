const ezs = require('@ezs/core');
const from = require('from');

describe('tsv-double-quotes.ini', () => {
    it('should parse a TSV with double quotes escaping', done => {
        // @ts-expect-error TS(7034) FIXME: Variable 'res' implicitly has type 'any[]' in some... Remove this comment to see the full error message
        const res = [];
        from(['a\tb\n', '"1\t2"\t3\n'])
            .pipe(ezs('delegate', { file: __dirname + '/tsv-double-quotes.ini' }))
            // @ts-expect-error TS(7006) FIXME: Parameter 'chunk' implicitly has an 'any' type.
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                // @ts-expect-error TS(2304) FIXME: Cannot find name 'expect'.
                expect(res).toEqual([{ a: '1\t2', b: '3' }]);
                done();
            });
    });
});
