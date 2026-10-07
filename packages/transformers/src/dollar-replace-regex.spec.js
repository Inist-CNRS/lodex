import from from 'from';
import ezs from '@ezs/core';
import statements from '.';

ezs.use(statements);

describe('$REPLACE_REGEX', () => {
    test('with valid parameter', (done) => {
        const script = `
            [$REPLACE_REGEX]
            field = b
            searchValue = un
            replaceValue = 1

            [exchange]
            value = omit('$origin')
        `;
        const res = [];
        from([
            { a: 1, b: 'un deux', c: true },
            { a: 2, b: 'un trois', c: true },
            { a: 3, b: 'un quatre', c: false },
            { a: 4, b: 'un cinq', c: true },
        ])
            .pipe(ezs('delegate', { script }))
            .pipe(ezs.catch())
            .on('error', done)
            .on('data', (chunk) => {
                expect(chunk).toEqual(expect.any(Object));
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toHaveLength(4);
                expect(res[0].b).toEqual('1 deux');
                expect(res[1].b).toEqual('1 trois');
                expect(res[2].b).toEqual('1 quatre');
                expect(res[3].b).toEqual('1 cinq');
                done();
            });
    });
    test('with regex', (done) => {
        const script = `
            [$REPLACE_REGEX]
            field=b
            searchValue = fix("^(.*)$")
            replaceValue = fix("uid:/$1")


            [exchange]
            value = omit('$origin')
        `;
        const res = [];
        from([
            { a: 1, b: 'deux', c: true },
            { a: 2, b: 'trois', c: true },
            { a: 3, b: 'quatre', c: false },
            { a: 4, b: 'cinq', c: true },
        ])
            .pipe(ezs('delegate', { script }))
            .pipe(ezs.catch())
            .on('error', done)
            .on('data', (chunk) => {
                expect(chunk).toEqual(expect.any(Object));
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toHaveLength(4);
                expect(res[0].b).toEqual('uid:/deux');
                expect(res[1].b).toEqual('uid:/trois');
                expect(res[2].b).toEqual('uid:/quatre');
                expect(res[3].b).toEqual('uid:/cinq');
                done();
            });
    });
    test('with regex & error', (done) => {
        const script = `
            [$REPLACE_REGEX]
            field=b
            searchValue = fix("^(.*)$")
            replaceValue = fix("uid:/$1")


            [exchange]
            value = omit('$origin')
        `;
        const res = [];
        from([
            { a: 1, b: null, c: true },
            { a: 2, b: 'trois', c: true },
            { a: 3, b: 'quatre', c: false },
            { a: 4, b: 'cinq', c: true },
        ])
            .pipe(ezs('delegate', { script }))
            .pipe(ezs.catch())
            .on('error', done)
            .on('data', (chunk) => {
                expect(chunk).toEqual(expect.any(Object));
                res.push(chunk);
            })
            .on('end', () => {
                expect(res).toHaveLength(4);
                expect(res[0].b).toEqual('uid:/');
                expect(res[1].b).toEqual('uid:/trois');
                expect(res[2].b).toEqual('uid:/quatre');
                expect(res[3].b).toEqual('uid:/cinq');
                done();
            });
    });
});
