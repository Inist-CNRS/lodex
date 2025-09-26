const ezs = require('@ezs/core');
const from = require('from');

describe('json-istex.ini', () => {
    it('should parse a JSON', done => {
        // @ts-expect-error TS(7034) FIXME: Variable 'res' implicitly has type 'any[]' in some... Remove this comment to see the full error message
        const res = [];
        const expected = [{ a: '1', b: '2' }];
        const input = { hits: expected };
        from([JSON.stringify(input)])
            .pipe(ezs('delegate', { file: __dirname + '/json-istex.ini' }))
            // @ts-expect-error TS(7006) FIXME: Parameter 'chunk' implicitly has an 'any' type.
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                // @ts-expect-error TS(2552) FIXME: Cannot find name 'expect'. Did you mean 'expected'... Remove this comment to see the full error message
                expect(res).toEqual(expected);
                done();
            });
    });
});
