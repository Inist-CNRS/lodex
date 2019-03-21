import ezs from 'ezs';
import from from 'from';

describe('tei.ini', () => {
    it('should parse a TEI XML', done => {
        const res = [];
        from([
            `<teiCorpus><TEI><any>value</any><any>other</any></TEI></teiCorpus>`,
        ])
            .pipe(ezs('delegate', { file: '/tei.ini' }))
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual([ { any: [ { $t: 'value' }, { $t: 'other' } ] } ]); // eslint-disable-line
                done();
            });
    });
});
