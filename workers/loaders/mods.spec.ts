const ezs = require('@ezs/core');
const from = require('from');

describe('mods.ini', () => {
    it('should parse a MODS XML', (done) => {
        const res: any = [];
        from([
            `<modsCollection><mods><any>value</any><other>thing</other></mods></modsCollection>`,
        ])
            .pipe(ezs('delegate', { file: __dirname + '/mods.ini' }))
            .on('data', (chunk: any) => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual([ { 'any/$t': 'value', 'other/$t': 'thing' } ]); // eslint-disable-line
                done();
            });
    });
});
