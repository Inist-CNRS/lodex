import expect from 'expect';
import ezs from 'ezs';
import from from 'from';

describe('xml.ini', () => {
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

    it('should parse a MODS XML', done => {
        const res = [];
        from([
            `<RmodsCollectionDF><mods><test>value</test></mods></RmodsCollectionDF>`,
        ])
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
