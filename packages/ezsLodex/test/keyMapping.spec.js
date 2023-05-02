import from from 'from';
import ezs from '@ezs/core';
import ezsLodex from '../src';

ezs.use(ezsLodex);

describe('keyMapping', () => {
    it("should replace all input's keys with matching keys", (done) => {
        const res = [];
        from([{
            dFgH: 'value',
            AaAa: 'value 2',
        }])
            .pipe(
                ezs('keyMapping',
                    {
                        from: ['dFgH', 'AaAa'],
                        to: ['Title', 'Description'],
                    }),
            )
            .on('data', (data) => {
                res.push(data);
            })
            .on('end', () => {
                expect(res).toEqual([{
                    Title: 'value',
                    Description: 'value 2',
                }]);
                done();
            })
            .on('error', done);
    });

    it("should replace all input's keys with matching keys in a script", (done) => {
        const res = [];
        from([{
            dFgH: 'value',
            AaAa: 'value 2',
        }])
            .pipe(
                ezs('delegate', {
                    script: `[keyMapping]
                from = dFgH
                to = Title

                from = AaAa
                to = Description
                `,
                }),
            )
            .on('data', (data) => {
                res.push(data);
            })
            .on('end', () => {
                expect(res).toEqual([{
                    Title: 'value',
                    Description: 'value 2',
                }]);
                done();
            })
            .on('error', done);
    });

    it('should keep unmapped keys', (done) => {
        const res = [];
        from([{
            dFgH: 'value',
            AaAa: 'value 2',
        }])
            .pipe(
                ezs('delegate', {
                    script: `[keyMapping]
                from = dFgH
                to = Title
                `,
                }),
            )
            .on('data', (data) => {
                res.push(data);
            })
            .on('end', () => {
                expect(res).toEqual([{
                    Title: 'value',
                    AaAa: 'value 2',
                }]);
                done();
            })
            .on('error', done);
    });
});
