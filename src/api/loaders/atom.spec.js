import ezs from 'ezs';
import from from 'from';

describe('atom.ini', () => {
    it('should parse an ATOM XML feed', done => {
        const res = [];
        from([
            `<feed><entry><any>value</any><other>thing</other></entry></feed>`,
        ])
            .pipe(ezs('delegate', { file: __dirname + '/atom.ini' }))
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual([ { 'any/$t': 'value', 'other/$t': 'thing' } ]); // eslint-disable-line
                done();
            });
    });
});
