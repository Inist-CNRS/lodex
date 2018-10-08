import ezs from 'ezs';
import from from 'from';
import statements from './index';
import testOne from './testOne';

ezs.use(statements);

describe('JSONLDString', () => {
    it('should export turtle RDF', done => {
        const stream = from([
            {
                'http://schema.org/name': 'Manu Sporny',
                'http://schema.org/url': { '@id': 'http://manu.sporny.org/' },
                'http://schema.org/image': {
                    '@id': 'http://manu.sporny.org/images/manu.png',
                },
            },
        ]).pipe(ezs('JSONLDString'));
        testOne(
            stream,
            output => {
                expect(output).toBe(
                    '_:b0 <http://schema.org/image> <http://manu.sporny.org/images/manu.png> .\n' +
                        '_:b0 <http://schema.org/name> "Manu Sporny" .\n' +
                        '_:b0 <http://schema.org/url> <http://manu.sporny.org/> .\n',
                );
            },
            done,
        );
    });
});
