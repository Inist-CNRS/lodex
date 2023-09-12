import from from 'from';
import ezs from '../../core/src';
import statements from '.';

ezs.use(statements);

describe('$CONCAT', () => {
    test('with valid parameter', (done) => {
        const script = `
            [$CONCAT]
            field = d
            columns = a
            columns = b

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
            .on('data', (chunk) => {
                expect(chunk).toEqual(expect.any(Object));
                output.push(chunk);
            })
            .on('end', () => {
                expect(output.length).toBe(4);
                expect(output[0].d[0]).toEqual('1');
                expect(output[0].d[1]).toEqual('un');
                expect(output[1].d[0]).toEqual('2');
                expect(output[1].d[1]).toEqual('deux');
                expect(output[2].d[0]).toEqual('3');
                expect(output[2].d[1]).toEqual('trois');
                expect(output[3].d[0]).toEqual('4');
                expect(output[3].d[1]).toEqual('quatre');
                done();
            });
    });
});
