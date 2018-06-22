import expect from 'expect';
import ezs from 'ezs';
import from from 'from';

describe('mods.ini', () => {
    it('should parse a MODS XML', done => {
        const res = [];
        from([
            `<modsCollection><mods><any>value</any><other>thing</other></mods></modsCollection>`,
        ])
            .pipe(ezs.fromFile(__dirname + '/mods.ini'))
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual([ { 'any/$t': 'value', 'other/$t': 'thing' } ]); // eslint-disable-line
                done();
            });
    });
});
