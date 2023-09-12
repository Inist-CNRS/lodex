import from from 'from';
import ezs from '../../core/src';
import statements from '.';

ezs.use(statements);

describe('$TRIM', () => {
    test('with valid parameter', (done) => {
        const script = `
            [$TRIM]
            field = b
            gap = 3

            [exchange]
            value = omit('$origin')
        `;
        const input = [
            { a: 1, b: ' un deux', c: true },
            { a: 2, b: ' un trois ', c: true },
            { a: 3, b: 'un quatre ', c: false },
            { a: 4, b: 'un cinq', c: true },
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
                expect(output[0].b).toEqual('un deux');
                expect(output[1].b).toEqual('un trois');
                expect(output[2].b).toEqual('un quatre');
                expect(output[3].b).toEqual('un cinq');
                done();
            });
    });
});
