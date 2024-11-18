import from from 'from';
import ezs from '@ezs/core';
import statements from '.';

ezs.use(statements);

describe('$COLUMN', () => {
    test('with valid parameter', done => {
        const script = `
            [$COLUMN]
            field = d
            column = b

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
                expect(output[0].d).toEqual('un');
                expect(output[1].d).toEqual('deux');
                expect(output[2].d).toEqual('trois');
                expect(output[3].d).toEqual('quatre');
                done();
            });
    });

    test('with valid parameter', done => {
        const script = `
            [$COLUMN]
            field = d
            column = b

            [$COLUMN]
            field = e
            column = a

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
                expect(output[0].d).toEqual('un');
                expect(output[1].d).toEqual('deux');
                expect(output[2].d).toEqual('trois');
                expect(output[3].d).toEqual('quatre');
                expect(output[0].e).toEqual('1');
                expect(output[1].e).toEqual('2');
                expect(output[2].e).toEqual('3');
                expect(output[3].e).toEqual('4');
                expect(output[0]).not.toHaveProperty('a');
                expect(output[0]).not.toHaveProperty('b');
                expect(output[1]).not.toHaveProperty('a');
                expect(output[1]).not.toHaveProperty('b');
                expect(output[2]).not.toHaveProperty('a');
                expect(output[2]).not.toHaveProperty('b');
                expect(output[3]).not.toHaveProperty('a');
                expect(output[3]).not.toHaveProperty('b');
                done();
            });
    });
});
