const ezs = require('@ezs/core');
const from = require('from');

describe('xml.ini', () => {
    it('should parse a RDF XML', done => {
        // @ts-expect-error TS(7034) FIXME: Variable 'res' implicitly has type 'any[]' in some... Remove this comment to see the full error message
        const res = [];
        from([
            `<root><row><f1>val1</f1><f2>val2</f2></row><row><f1>val1</f1><f2>val2</f2></row></root>`,
        ])
            .pipe(ezs('delegate', { file: __dirname + '/xml.ini' }))
            // @ts-expect-error TS(7006) FIXME: Parameter 'chunk' implicitly has an 'any' type.
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res.length).toEqual(2); // eslint-disable-line
                // @ts-expect-error TS(2304) FIXME: Cannot find name 'expect'.
                expect(res).toEqual([ { 'f1/$t': 'val1', 'f2/$t': 'val2' }, { 'f1/$t': 'val1', 'f2/$t': 'val2' } ]); // eslint-disable-line
                done();
            });
    });

    it('should parse a MODS XML', done => {
        // @ts-expect-error TS(7034) FIXME: Variable 'res' implicitly has type 'any[]' in some... Remove this comment to see the full error message
        const res = [];
        from([
            `<modsCollection><mods><test>value</test></mods></modsCollection>`,
        ])
            .pipe(ezs('delegate', { file: __dirname + '/xml.ini' }))
            // @ts-expect-error TS(7006) FIXME: Parameter 'chunk' implicitly has an 'any' type.
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
              // @ts-expect-error TS(2304) FIXME: Cannot find name 'expect'.
              expect(res).toEqual([{ 'test/$t': 'value' }]); // eslint-disable-line
                done();
            });
    });
});
