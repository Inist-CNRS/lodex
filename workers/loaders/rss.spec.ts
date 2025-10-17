import from from 'from';
// @ts-expect-error TS7016
import ezs from '@ezs/core';

describe('rss.ini', () => {
    it('should parse a RSS XML', (done) => {
        const res: any = [];
        from([
            `<rss><channel><item><any>value</any><other>thing</other></item></channel></rss>`,
        ])
            .pipe(ezs('delegate', { file: __dirname + '/rss.ini' }))
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
