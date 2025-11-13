import from from 'from';
// @ts-expect-error TS7016
import ezs from '@ezs/core';

describe('json-lodex.ini', () => {
    it('should parse a JSON', (done) => {
        const res: any = [];
        const expected = [{ a: '1', b: '2' }];
        const input = { data: expected };
        from([JSON.stringify(input)])
            .pipe(ezs('delegate', { file: __dirname + '/json-lodex.ini' }))
            .on('data', (chunk: any) => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toMatchObject(expected);
                done();
            });
    });
});
