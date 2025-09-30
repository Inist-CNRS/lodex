import from from 'from';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message
import ezs from '@ezs/core';
import testOne from './testOne';
import statements from '../src';

ezs.use(statements);

describe('objects2columns', () => {
    it('should return when columns', (done: any) => {
        const stream = from([
            {
                truc: {
                    hello: 'world',
                },
            },
        ]).pipe(ezs('objects2columns'));
        testOne(
            stream,
            (output: any) => {
                expect(output);
                expect(output.truc).toEqual('{"hello":"world"}');
            },
            done,
        );
    });

    it('should return when columns non object', (done: any) => {
        const stream = from([
            {
                truc: 'anything else',
                bidule: 1,
            },
        ]).pipe(ezs('objects2columns'));
        testOne(
            stream,
            (output: any) => {
                expect(output);
                expect(output.truc).toBe('anything else');
                expect(output.bidule).toBe(1);
            },
            done,
        );
    });
});
