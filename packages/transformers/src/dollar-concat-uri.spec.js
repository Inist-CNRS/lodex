import from from 'from';
import ezs from '@ezs/core';
import statements from '.';

ezs.use(statements);

describe('$CONCAT_URI', () => {
    test('with valid parameter', done => {
        const script = `
            [$CONCAT_URI]
            field = d
            column = a
            column = b
            separator = %

            [exchange]
            value = omit('$origin')
        `;
        const input = [
            { a: '1', b: 'un', c: true },
            { a: '2', b: 'deux', c: true },
            { a: '3', b: 'trois', c: false },
            { a: '4', b: 'quatre', c: true },
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
                expect(output[0].d).toEqual('1%un');
                expect(output[1].d).toEqual('2%deux');
                expect(output[2].d).toEqual('3%trois');
                expect(output[3].d).toEqual('4%quatre');
                done();
            });
    });
});
