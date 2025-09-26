const ezs = require('@ezs/core');
const from = require('from');

describe('rss.ini', () => {
    it('should parse a RSS XML', done => {
        // @ts-expect-error TS(7034) FIXME: Variable 'res' implicitly has type 'any[]' in some... Remove this comment to see the full error message
        const res = [];
        from([
            `<rss><channel><item><any>value</any><other>thing</other></item></channel></rss>`,
        ])
            .pipe(ezs('delegate', { file: __dirname + '/rss.ini' }))
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
