import from from 'from';
// @ts-expect-error TS7016
import ezs from '@ezs/core';

describe('atom.ini', () => {
    it('should parse an ATOM XML feed', (done) => {
        const res: any = [];
        from([
            `<feed><entry><any>value</any><other>thing</other></entry></feed>`,
        ])
            .pipe(ezs('delegate', { file: __dirname + '/atom.ini' }))
            .on('data', (chunk: any) => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toMatchObject([
                    { 'any/_t': 'value', 'other/_t': 'thing' },
                ]);
                done();
            });
    });
});
