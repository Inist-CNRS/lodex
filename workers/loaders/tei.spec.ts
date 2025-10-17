import from from 'from';
// @ts-expect-error TS7016
import ezs from '@ezs/core';

describe('tei.ini', () => {
    it('should parse a TEI XML', (done) => {
        const res: any = [];
        from([
            `<teiCorpus><TEI><any>value</any><any>other</any></TEI></teiCorpus>`,
        ])
            .pipe(ezs('delegate', { file: __dirname + '/tei.ini' }))
            .on('data', (chunk: any) => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toMatchObject([
                    { 'any/0/_t': 'value', 'any/1/_t': 'other' },
                ]);
                done();
            });
    });
});
