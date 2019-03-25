import ezs from 'ezs';
import from from 'from';

describe('rdf.ini', () => {
    it('should parse a RDF XML', done => {
        const res = [];
        from([`<RDF><item><any>value</any><other>thing</other></item></RDF>`])
            .pipe(ezs('delegate', { file: __dirname + '/rdf.ini' }))
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual([ { 'any/$t': 'value', 'other/$t': 'thing' } ]); // eslint-disable-line
                done();
            });
    });

    it('should parse a rdf:RDF XML', done => {
        const res = [];
        from([
            `<rdf:RDF><item><any>value</any><other>thing</other></item></rdf:RDF>`,
        ])
            .pipe(ezs('delegate', { file: __dirname + '/rdf.ini' }))
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual([ { 'any/$t': 'value', 'other/$t': 'thing' } ]); // eslint-disable-line
                done();
            });
    });
});
