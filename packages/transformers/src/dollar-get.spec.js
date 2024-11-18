import from from 'from';
import ezs from '@ezs/core';
import statements from '.';

ezs.use(statements);

describe('$GET', () => {
    test('with valid parameter', done => {
        const script = `
            [$GET]
            field = c
            path = d

            [exchange]
            value = omit('$origin')
        `;
        const input = [
            { a: 1, b: 'un deux', c: { d: 'OK' } },
            { a: 2, b: 'un trois', c: { d: 'OK' } },
            { a: 3, b: 'un quatre', c: { d: 'OK' } },
            { a: 4, b: 'un cinq', c: { d: 'OK' } },
        ];
        const output = [];
        from(input)
            .pipe(ezs('delegate', { script }))
            .pipe(ezs.catch())
            .on('error', done)
            .on('data', chunk => {
                expect(chunk).toEqual(expect.any(Object));
                output.push(chunk);
            })
            .on('end', () => {
                expect(output).toHaveLength(4);
                expect(output[0].c).toEqual('OK');
                expect(output[1].c).toEqual('OK');
                expect(output[2].c).toEqual('OK');
                expect(output[3].c).toEqual('OK');
                done();
            });
    });
});
