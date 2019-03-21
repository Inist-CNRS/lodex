import ezs from 'ezs';
import from from 'from';

describe('skos.ini', () => {
    it('should parse a skos XML', done => {
        const res = [];
        from([`<RDF><doc><any>value</any><other>thing</other></doc></RDF>`])
            .pipe(ezs('delegate', { file: '/skos.ini' }))
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual([ { any: 'value', other: 'thing' } ]); // eslint-disable-line
                done();
            });
    });
});
