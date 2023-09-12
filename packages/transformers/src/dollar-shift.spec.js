import from from 'from';
import ezs from '../../core/src';
import statements from '.';

ezs.use(statements);

describe('$SHIFT', () => {
    test('with valid parameter', (done) => {
        const script = `
            [$SHIFT]
            field = b
            gap = 2

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
            .on('data', (chunk) => {
                expect(chunk).toEqual(expect.any(Object));
                output.push(chunk);
            })
            .on('end', () => {
                expect(output.length).toBe(4);
                expect(output[0].b.length).toEqual(1);
                expect(output[0].b[0]).toEqual('trois');
                expect(output[1].b.length).toEqual(1);
                expect(output[1].b[0]).toEqual('quatre');
                expect(output[2].b.length).toEqual(1);
                expect(output[2].b[0]).toEqual('cinq');
                expect(output[3].b.length).toEqual(1);
                expect(output[3].b[0]).toEqual('six');
                done();
            });
    });
});
