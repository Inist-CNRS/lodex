const ezs = require('@ezs/core');
const from = require('from');

describe('xml.ini', () => {
    it('should parse a RDF XML', (done) => {
        const res: any = [];
        from([
            `<root><row><f1>val1</f1><f2>val2</f2></row><row><f1>val1</f1><f2>val2</f2></row></root>`,
        ])
            .pipe(ezs('delegate', { file: __dirname + '/xml.ini' }))
            .on('data', (chunk: any) => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res.length).toEqual(2); // eslint-disable-line
                expect(res).toEqual([ { 'f1/$t': 'val1', 'f2/$t': 'val2' }, { 'f1/$t': 'val1', 'f2/$t': 'val2' } ]); // eslint-disable-line
                done();
            });
    });

    it('should parse a MODS XML', (done) => {
        const res: any = [];
        from([
            `<modsCollection><mods><test>value</test></mods></modsCollection>`,
        ])
            .pipe(ezs('delegate', { file: __dirname + '/xml.ini' }))
            .on('data', (chunk: any) => {
                res.push(chunk);
            })
            .on('end', () => {
              expect(res).toEqual([{ 'test/$t': 'value' }]); // eslint-disable-line
                done();
            });
    });
});
