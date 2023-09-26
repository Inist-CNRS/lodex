import from from 'from';
import ezs from '@ezs/core';
import statements from '.';

ezs.use(statements);

describe('$TRUNCATE_WORDS', () => {
    test('with valid parameter', done => {
        const script = `
            [$TRUNCATE_WORDS]
            field = b
            gap = 2

            [exchange]
            value = omit('$origin')
        `;
        const input = [
            { a: 1, b: 'un deux trois', c: true },
            { a: 2, b: 'un trois cinq', c: true },
            { a: 3, b: 'un quatre sept', c: false },
            { a: 4, b: 'un cinq neuf', c: true },
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
                expect(output[0].b).toEqual('un deux');
                expect(output[1].b).toEqual('un trois');
                expect(output[2].b).toEqual('un quatre');
                expect(output[3].b).toEqual('un cinq');
                done();
            });
    });
});
