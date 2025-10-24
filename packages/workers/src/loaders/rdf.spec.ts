import from from 'from';
// @ts-expect-error TS7016
import ezs from '@ezs/core';

describe('rdf.ini', () => {
    it('should parse a RDF XML', (done) => {
        const res: any = [];
        from([`<RDF><item><any>value</any><other>thing</other></item></RDF>`])
            .pipe(ezs('delegate', { file: __dirname + '/rdf.ini' }))
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

    it('should parse a rdf:RDF XML', (done) => {
        const res: any = [];
        from([
            `<rdf:RDF><item><any>value</any><other>thing</other></item></rdf:RDF>`,
        ])
            .pipe(ezs('delegate', { file: __dirname + '/rdf.ini' }))
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
