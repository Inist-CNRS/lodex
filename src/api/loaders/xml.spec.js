import expect from 'expect';
import ezs from 'ezs';
import from from 'from';

describe.only('xml.ini', () => {
    it('should parse a RDF XML', done => {
        const res = [];
        from([`<RDF><test>value</test></RDF>`])
            .pipe(ezs.fromFile(__dirname + '/xml.ini'))
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual([{ '$t': 'value' }]); // eslint-disable-line
                done();
            });
    });
});
