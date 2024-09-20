import from from 'from';
import ezs from '@ezs/core';
import statements from '.';

ezs.use(statements);

describe('$URLENCODE', () => {
    test('with valid parameter', done => {
        const script = `
            [$URLENCODE]
            field = b

            [exchange]
            value = omit('$origin')
        `;
        const res = [];
        from([
            { a: 1, b: 'é deux', c: true },
            { a: 2, b: 'é trois', c: true },
            { a: 3, b: 'é quatre', c: false },
            { a: 4, b: 'é cinq', c: true },
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
                expect(res[0].b).toEqual('%C3%A9%20deux');
                expect(res[1].b).toEqual('%C3%A9%20trois');
                expect(res[2].b).toEqual('%C3%A9%20quatre');
                expect(res[3].b).toEqual('%C3%A9%20cinq');
                done();
            });
    });
});
