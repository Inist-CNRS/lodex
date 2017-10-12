import expect from 'expect';
import ezs from 'ezs';
import from from 'from';
import statements from './index';
import testOne from './testOne';

ezs.use(statements);

describe('LodexConfig', () => {
    it('should return when no uri', (done) => {
        const stream = from([{}])
            .pipe(ezs('LodexConfig'));
        testOne(
            stream,
            (output) => {
                expect(output.$config.host).toExist();
            },
            done,
        );
    });
});
