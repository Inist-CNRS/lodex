const ezs = require('@ezs/core');
const from = require('from');

describe('skos.ini', () => {
    it('should parse a skos XML', (done) => {
        const res: any = [];
        from([`<RDF><doc><any>value</any><other>thing</other></doc></RDF>`])
            .pipe(ezs('delegate', { file: __dirname + '/skos.ini' }))
            .on('data', (chunk: any) => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual([ { any: 'value', other: 'thing' } ]); // eslint-disable-line
                done();
            });
    });
});
