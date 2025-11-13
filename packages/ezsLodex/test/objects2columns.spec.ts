// @ts-expect-error TS(1259): Module '"/home/madeorsk/Cloud/Marmelab/Code/lodex/... Remove this comment to see the full error message
import from from 'from';
// @ts-expect-error TS(2792): Cannot find module '@ezs/core'. Did you mean to se... Remove this comment to see the full error message
import ezs from '@ezs/core';
import testOne from './testOne';
// @ts-expect-error TS(2792): Cannot find module '../src'. Did you mean to set t... Remove this comment to see the full error message
import statements from '../src';

ezs.use(statements);

describe('objects2columns', () => {
    it('should return when columns', (done) => {
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
                // @ts-expect-error TS(2551): Property 'toEqual' does not exist on type 'Asserti... Remove this comment to see the full error message
                expect(output.truc).toEqual('{"hello":"world"}');
            },
            done,
        );
    });

    it('should return when columns non object', (done) => {
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
                // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                expect(output.truc).toBe('anything else');
                // @ts-expect-error TS(2339): Property 'toBe' does not exist on type 'Assertion'... Remove this comment to see the full error message
                expect(output.bidule).toBe(1);
            },
            done,
        );
    });
});
