import ezs from 'ezs';
import from from 'from';
import statements from './index';
import testOne from './testOne';

ezs.use(statements);

describe('objects2columns', () => {
    it('should return when columns', done => {
        const stream = from([
            {
                truc: {
                    hello: 'world',
                },
            },
        ]).pipe(ezs('objects2columns'));
        testOne(
            stream,
            output => {
                expect(output).toBeTruthy();
                expect(output.truc).toBe('{"hello":"world"}');
            },
            done,
        );
    });
});
