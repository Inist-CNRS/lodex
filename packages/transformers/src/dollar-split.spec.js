import from from 'from';
import ezs from '@ezs/core';
import statements from '.';

ezs.use(statements);

describe('$SPLIT', () => {
    test('with valid parameter', done => {
        const script = `
            [$SPLIT]
            field = b
            separator = fix(' ')

            [exchange]
            value = omit('$origin')
        `;
        const input = [
            { a: 1, b: 'un deux', c: true },
            { a: 2, b: 'un trois', c: true },
            { a: 3, b: 'un quatre', c: false },
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
                expect(output[0].b[1]).toEqual('deux');
                expect(output[1].b[1]).toEqual('trois');
                expect(output[2].b[1]).toEqual('quatre');
                expect(output[3].b[1]).toEqual('cinq');
                done();
            });
    });
});
