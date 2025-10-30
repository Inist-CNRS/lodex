import from from 'from';
// @ts-expect-error TS7016
import ezs from '@ezs/core';

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
                expect(res.length).toEqual(2);
                expect(res).toMatchObject([
                    { 'f1/_t': 'val1', 'f2/_t': 'val2' },
                    { 'f1/_t': 'val1', 'f2/_t': 'val2' },
                ]);
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
                expect(res).toMatchObject([{ 'test/_t': 'value' }]);
                done();
            });
    });
});
