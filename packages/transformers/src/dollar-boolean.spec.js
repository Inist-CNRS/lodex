import from from 'from';
import ezs from '@ezs/core';
import statements from '.';

ezs.use(statements);

describe('$BOOLEAN', () => {
    test('with valid parameter', done => {
        const script = `
            [$BOOLEAN]
            field = c

            [exchange]
            value = omit('$origin')
        `;
        const input = [
            { a: 1, b: 'un deux', c: 'true' },
            { a: 2, b: 'un trois', c: true },
            { a: 3, b: 'un quatre', c: 1 },
            { a: 4, b: 'un cinq', c: 'OK' },
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
                expect(output[0].c).toEqual(true);
                expect(output[1].c).toEqual(true);
                expect(output[2].c).toEqual(true);
                expect(output[3].c).toEqual(true);
                done();
            });
    });
});
