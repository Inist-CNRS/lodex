const ezs = require('@ezs/core');
const from = require('from');

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
                expect(res).toEqual([ { any: [ { $t: 'value' }, { $t: 'other' } ] } ]); // eslint-disable-line
                done();
            });
    });
});
