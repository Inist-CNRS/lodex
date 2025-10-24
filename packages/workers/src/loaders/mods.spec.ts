import from from 'from';
// @ts-expect-error TS7016
import ezs from '@ezs/core';

describe('mods.ini', () => {
    it('should parse a MODS XML', (done) => {
        const res: any = [];
        from([
            `<modsCollection><mods><any>value</any><other>thing</other></mods></modsCollection>`,
        ])
            .pipe(ezs('delegate', { file: __dirname + '/mods.ini' }))
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
