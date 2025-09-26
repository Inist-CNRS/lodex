const ezs = require('@ezs/core');
const from = require('from');

describe('rdf.ini', () => {
    it('should parse a RDF XML', done => {
        // @ts-expect-error TS(7034) FIXME: Variable 'res' implicitly has type 'any[]' in some... Remove this comment to see the full error message
        const res = [];
        from([`<RDF><item><any>value</any><other>thing</other></item></RDF>`])
            .pipe(ezs('delegate', { file: __dirname + '/rdf.ini' }))
            // @ts-expect-error TS(7006) FIXME: Parameter 'chunk' implicitly has an 'any' type.
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                // @ts-expect-error TS(2304) FIXME: Cannot find name 'expect'.
                expect(res).toEqual([ { 'any/$t': 'value', 'other/$t': 'thing' } ]); // eslint-disable-line
                done();
            });
    });

    it('should parse a rdf:RDF XML', done => {
        // @ts-expect-error TS(7034) FIXME: Variable 'res' implicitly has type 'any[]' in some... Remove this comment to see the full error message
        const res = [];
        from([
            `<rdf:RDF><item><any>value</any><other>thing</other></item></rdf:RDF>`,
        ])
            .pipe(ezs('delegate', { file: __dirname + '/rdf.ini' }))
            // @ts-expect-error TS(7006) FIXME: Parameter 'chunk' implicitly has an 'any' type.
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                // @ts-expect-error TS(2304) FIXME: Cannot find name 'expect'.
                expect(res).toEqual([ { 'any/$t': 'value', 'other/$t': 'thing' } ]); // eslint-disable-line
                done();
            });
    });
});
