const ezs = require('@ezs/core');
const from = require('from');

describe('tei.ini', () => {
    it('should parse a TEI XML', done => {
        // @ts-expect-error TS(7034) FIXME: Variable 'res' implicitly has type 'any[]' in some... Remove this comment to see the full error message
        const res = [];
        from([
            `<teiCorpus><TEI><any>value</any><any>other</any></TEI></teiCorpus>`,
        ])
            .pipe(ezs('delegate', { file: __dirname + '/tei.ini' }))
            // @ts-expect-error TS(7006) FIXME: Parameter 'chunk' implicitly has an 'any' type.
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                // @ts-expect-error TS(2304) FIXME: Cannot find name 'expect'.
                expect(res).toEqual([ { any: [ { $t: 'value' }, { $t: 'other' } ] } ]); // eslint-disable-line
                done();
            });
    });
});
