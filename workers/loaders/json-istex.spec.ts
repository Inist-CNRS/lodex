import from from 'from';
// @ts-expect-error TS7016
import ezs from '@ezs/core';

describe('json-istex.ini', () => {
    it('should parse a JSON', (done) => {
        const res: any = [];
        const expected = [{ a: '1', b: '2' }];
        const input = { hits: expected };
        from([JSON.stringify(input)])
            .pipe(ezs('delegate', { file: __dirname + '/json-istex.ini' }))
            .on('data', (chunk: any) => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toMatchObject(expected);
                done();
            });
    });
});
