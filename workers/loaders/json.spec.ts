import from from 'from';
// @ts-expect-error TS7016
import ezs from '@ezs/core';

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
                expect(res).toMatchObject(expected);
                done();
            });
    });
});
