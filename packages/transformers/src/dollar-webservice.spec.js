import from from 'from';
import ezs from '@ezs/core';
import statements from '.';

ezs.use(statements);

describe('$WEBSERVICE', () => {
    test('with valid parameter', done => {
        const script = `
            [$WEBSERVICE]
            field = aaa
            webservice = toto

            [exchange]
            webservice = omit('$origin')
        `;
        const res = [];
        from([
            { a: 1, b: 'deux', c: true },
            { a: 2, b: 'trois', c: true },
            { a: 3, b: 'quatre', c: false },
            { a: 4, b: 'cinq', c: true },
        ])
            .pipe(ezs('delegate', { script }))
            .pipe(ezs.catch())
            .on('error', done)
            .on('data', chunk => {
                expect(chunk).toEqual(expect.any(Object));
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toHaveLength(4);
                expect(res[0].aaa).toEqual('toto');
                expect(res[1].aaa).toEqual('toto');
                expect(res[2].aaa).toEqual('toto');
                expect(res[3].aaa).toEqual('toto');
                done();
            });
    });
});
