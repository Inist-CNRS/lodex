import from from 'from';
import ezs from '@ezs/core';
import statements from '.';

ezs.use(statements);

describe('$NUMBER', () => {
    test('with valid parameter', done => {
        const script = `
            [$NUMBER]
            field = a

            [exchange]
            value = omit('$origin')
        `;
        const input = [
            { a: '1', b: 'un deux', c: true },
            { a: '2', b: 'un trois', c: true },
            { a: '3', b: 'un quatre', c: false },
            { a: '4', b: 'un cinq', c: true },
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
                expect(output[0].a).toEqual(1);
                expect(output[1].a).toEqual(2);
                expect(output[2].a).toEqual(3);
                expect(output[3].a).toEqual(4);
                done();
            });
    });
});
