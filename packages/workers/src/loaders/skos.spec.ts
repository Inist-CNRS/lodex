import from from 'from';
// @ts-expect-error TS7016
import ezs from '@ezs/core';

describe('skos.ini', () => {
    //FIXME This test fails.
    it.skip('should parse a skos XML', (done) => {
        const res: any = [];
        from([`<RDF><doc><any>value</any><other>thing</other></doc></RDF>`])
            .pipe(ezs('delegate', { file: __dirname + '/skos.ini' }))
            .on('data', (chunk: any) => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toMatchObject([{ any: 'value', other: 'thing' }]);
                done();
            });
    });
});
