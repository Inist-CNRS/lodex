import from from 'from';
import ezs from '../../core/src';
import statements from '.';

ezs.use(statements);

describe('$MAPPING', () => {
    test('with valid parameter', (done) => {
        const script = `
            [$MAPPING]
            field = b
            list = "INSB": "INSB - Institut des sciences biologiques", "INC": "INC - Institut de chimie", "INEE": "INEE - Institut écologie et environnement",

            [exchange]
            value = omit('$origin')
        `;
        const input = [
            { a: 1, b: 'INSB' },
            { a: 2, b: 'INEE' },
            { a: 3, b: 'INC' },
            { a: 4, b: 'INS2I' },
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
                expect(output[0].b).toEqual('INSB - Institut des sciences biologiques');
                expect(output[1].b).toEqual('INEE - Institut écologie et environnement');
                expect(output[2].b).toEqual('INC - Institut de chimie');
                expect(output[3].b).toEqual('INS2I');
                done();
            });
    });
});
