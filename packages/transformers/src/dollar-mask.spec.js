import from from 'from';
import ezs from '../../core/src';
import statements from '.';

ezs.use(statements);

describe('$MASK', () => {
    test('with valid parameter', (done) => {
        const script = `
            [$MASK]
            field = b
            with = ^[a-z]+$

            [exchange]
            value = omit('$origin')
        `;
        const input = [
            { a: 1, b: 'deux', c: true },
            { a: 2, b: 'trois', c: true },
            { a: 3, b: 'un quatre', c: false },
            { a: 4, b: 'cinq', c: true },
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
                expect(output[0].b).toEqual('deux');
                expect(output[1].b).toEqual('trois');
                expect(output[2].b).toBeNull();
                expect(output[3].b).toEqual('cinq');
                done();
            });
    });
});
