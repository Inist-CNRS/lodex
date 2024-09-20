import from from 'from';
import ezs from '@ezs/core';
import statements from '.';

ezs.use(statements);

describe('$DEFAULT', () => {
    test('with valid parameter', done => {
        const script = `
            [$DEFAULT]
            field = b
            alternative = un quatre

            [exchange]
            value = omit('$origin')
        `;
        const input = [
            { a: 1, b: 'un deux', c: true },
            { a: 2, b: 'un trois', c: true },
            { a: 3, b: null, c: false },
            { a: 4, b: 'un cinq', c: true },
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
                expect(output[0].b).toEqual('un deux');
                expect(output[1].b).toEqual('un trois');
                expect(output[2].b).toEqual('un quatre');
                expect(output[3].b).toEqual('un cinq');
                done();
            });
    });
});
