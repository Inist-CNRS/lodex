import from from 'from';
import ezs from '@ezs/core';
import statements from '.';

ezs.use(statements);

describe('$REMOVE', () => {
    test('with valid parameter', done => {
        const script = `
            [$REMOVE]
            field = b
            the = un

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
                expect(output[0].b).toHaveLength(2);
                expect(output[0].b[1]).toEqual('trois');
                expect(output[1].b).toHaveLength(2);
                expect(output[1].b[1]).toEqual('quatre');
                expect(output[2].b).toHaveLength(2);
                expect(output[2].b[1]).toEqual('cinq');
                expect(output[3].b).toHaveLength(2);
                expect(output[3].b[1]).toEqual('six');
                done();
            });
    });
});
