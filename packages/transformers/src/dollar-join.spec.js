import from from 'from';
import ezs from '@ezs/core';
import statements from '.';

ezs.use(statements);

describe('$JOIN', () => {
    test('with valid parameter', done => {
        const script = `
            [$JOIN]
            field = b
            separator = fix(' ')

            [exchange]
            value = omit('$origin')
        `;
        const input = [
            { a: 1, b: ['un', 'deux', 'trois'] },
            { a: 2, b: ['un', 'deux', 'quatre'] },
            { a: 3, b: ['un', 'deux', 'cinq'] },
            { a: 4, b: ['un', 'deux', 'six'] },
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
                expect(output).toHaveLengt(4);
                expect(output[0].b).toEqual('un deux trois');
                expect(output[1].b).toEqual('un deux quatre');
                expect(output[2].b).toEqual('un deux cinq');
                expect(output[3].b).toEqual('un deux six');
                done();
            });
    });
});
