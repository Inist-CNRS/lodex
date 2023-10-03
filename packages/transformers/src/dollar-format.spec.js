import from from 'from';
import ezs from '@ezs/core';
import statements from '.';

ezs.use(statements);

describe('$FORMAT', () => {
    test('with valid parameter', done => {
        const script = `
            [$FORMAT]
            field = b
            with  = (%s:%s)

            [exchange]
            value = omit('$origin')
        `;
        const input = [
            { a: 1, b: ['un', 'trois'] },
            { a: 2, b: ['un', 'quatre'] },
            { a: 3, b: ['un', 'cinq'] },
            { a: 4, b: ['un', 'six'] },
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
                expect(output[0].b).toEqual('(un:trois)');
                expect(output[1].b).toEqual('(un:quatre)');
                expect(output[2].b).toEqual('(un:cinq)');
                expect(output[3].b).toEqual('(un:six)');

                done();
            });
    });
});
