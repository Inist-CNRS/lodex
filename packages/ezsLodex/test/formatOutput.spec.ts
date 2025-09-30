import from from 'from';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message
import ezs from '@ezs/core';
import ezsLodex from '../src';

ezs.use(ezsLodex);

describe('formatOutput', () => {
    it('should stringify stream', (done: any) => {
        let res = '';
        from([
            { a: 1, b: 2 },
            { a: 3, b: 4 },
        ])
            .pipe(ezs('LodexOutput'))
            .on('data', (data: any) => {
                res += data;
            })
            .on('end', () => {
                expect(res).toHaveLength(40);
                expect(res).toBe('{"data":[{"a":1,"b":2},\n{"a":3,"b":4}]}\n');
                const json = JSON.parse(res);
                expect(json).toEqual({
                    data: [
                        { a: 1, b: 2 },
                        { a: 3, b: 4 },
                    ],
                });
                done();
            });
    });

    it('should stringify stream', (done: any) => {
        let res = '';
        from([{ a: 1, b: 2 }])
            .pipe(ezs('LodexOutput'))
            .on('data', (data: any) => {
                res += data;
            })
            .on('end', () => {
                const json = JSON.parse(res);
                expect(json).toEqual({
                    data: [{ a: 1, b: 2 }],
                });
                done();
            });
    });

    it('should indent output when asked', (done: any) => {
        let res = '';
        from([
            { a: 1, b: 2 },
            { a: 3, b: 4 },
        ])
            .pipe(ezs('LodexOutput', { indent: true }))
            .on('data', (data: any) => {
                res += data;
            })
            .on('end', () => {
                expect(res).toHaveLength(66);
                expect(res).toBe(
                    '{"data":[{\n    "a": 1,\n    "b": 2\n},\n{\n    "a": 3,\n    "b": 4\n}]}\n',
                );
                done();
            });
    });

    it('should extract a property from objects #1', (done: any) => {
        let res = '';
        from([
            { a: 1, b: 2, t: 3 },
            { a: 4, b: 5, t: 6 },
        ])
            .pipe(ezs('LodexOutput', { extract: 't' }))
            .on('data', (data: any) => {
                res += data;
            })
            .on('end', () => {
                const json = JSON.parse(res);
                expect(json).toEqual({
                    data: [
                        { a: 1, b: 2 },
                        { a: 4, b: 5 },
                    ],
                    t: 3,
                });
                done();
            });
    });

    it('should extract a property from objects #2', (done: any) => {
        let res = '';
        from([
            { a: 1, b: 2, t: 3 },
            { a: 4, b: 5, t: 6 },
        ])
            .pipe(ezs('LodexOutput', { extract: ['t', 'x'] }))
            .on('data', (data: any) => {
                res += data;
            })
            .on('end', () => {
                const json = JSON.parse(res);
                expect(json).toEqual({
                    data: [
                        { a: 1, b: 2 },
                        { a: 4, b: 5 },
                    ],
                    t: 3,
                });
                done();
            });
    });

    it('should extract a property from objects #3', (done: any) => {
        let res = '';
        from([
            {
                a: 1,
                b: 2,
                t: 3,
                x: 4,
            },
            {
                a: 4,
                b: 5,
                t: 6,
                x: 4,
            },
        ])
            .pipe(ezs('LodexOutput', { extract: ['t', 'x'] }))
            .on('data', (data: any) => {
                res += data;
            })
            .on('end', () => {
                const json = JSON.parse(res);
                expect(json).toEqual({
                    data: [
                        { a: 1, b: 2 },
                        { a: 4, b: 5 },
                    ],
                    t: 3,
                    x: 4,
                });
                done();
            });
    });

    it('should extract a property from objects #3', (done: any) => {
        let res = '';
        from([
            { a: 1, b: 2 },
            { a: 4, b: 5 },
        ])
            .pipe(ezs('LodexOutput', { extract: 'x' }))
            .on('data', (data: any) => {
                res += data;
            })
            .on('end', () => {
                const json = JSON.parse(res);
                expect(json).toEqual({
                    data: [
                        { a: 1, b: 2 },
                        { a: 4, b: 5 },
                    ],
                });
                done();
            });
    });

    it('should use keyName', (done: any) => {
        let res = '';
        from([
            { a: 1, b: 2 },
            { a: 3, b: 4 },
        ])
            .pipe(ezs('LodexOutput', { keyName: 'chuck' }))
            .on('data', (data: any) => {
                res += data;
            })
            .on('end', () => {
                const json = JSON.parse(res);
                expect(json).toHaveProperty('chuck');
                expect(json).toEqual({
                    chuck: [
                        { a: 1, b: 2 },
                        { a: 3, b: 4 },
                    ],
                });
                done();
            });
    });

    it('should return empty array', (done: any) => {
        let res = '';
        from([])
            .pipe(ezs('LodexOutput'))
            .on('data', (data: any) => {
                res += data;
            })
            .on('end', () => {
                expect(res).toEqual('');
                done();
            });
    });
});
