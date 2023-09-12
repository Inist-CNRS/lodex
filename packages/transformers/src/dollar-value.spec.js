import from from 'from';
import ezs from '../../core/src';
import statements from '.';

ezs.use(statements);

describe('$VALUE', () => {
    test('with valid parameter', (done) => {
        const script = `
            [$VALUE]
            field = aaa
            value = toto

            [exchange]
            value = omit('$origin')
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
            .on('data', (chunk) => {
                expect(chunk).toEqual(expect.any(Object));
                res.push(chunk);
            })
            .on('end', () => {
                expect(res.length).toBe(4);
                expect(res[0].aaa).toEqual('toto');
                expect(res[1].aaa).toEqual('toto');
                expect(res[2].aaa).toEqual('toto');
                expect(res[3].aaa).toEqual('toto');
                done();
            });
    });
});
