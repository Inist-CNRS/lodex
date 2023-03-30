import from from 'from';
import ezs from '@ezs/core';
import statements from '../statements/';
import testOne from './testOne';

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
            (output) => {
                expect(output);
                expect(output.truc).toEqual('{"hello":"world"}');
            },
            done,
        );
    });

    it('should return when columns non object', (done) => {
        const stream = from([{
            truc: 'anything else',
            bidule: 1,
        }]).pipe(ezs('objects2columns'));
        testOne(
            stream,
            (output) => {
                expect(output);
                expect(output.truc).toBe('anything else');
                expect(output.bidule).toBe(1);
            },
            done,
        );
    });
});
