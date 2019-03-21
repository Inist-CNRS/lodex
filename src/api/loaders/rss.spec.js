import ezs from 'ezs';
import from from 'from';

describe('rss.ini', () => {
    it('should parse a RSS XML', done => {
        const res = [];
        from([
            `<rss><channel><item><any>value</any><other>thing</other></item></channel></rss>`,
        ])
            .pipe(ezs('delegate', { file: '/rss.ini' }))
            .on('data', chunk => {
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toEqual([ { 'any/$t': 'value', 'other/$t': 'thing' } ]); // eslint-disable-line
                done();
            });
    });
});
