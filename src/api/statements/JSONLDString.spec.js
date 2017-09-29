import expect from 'expect';
import ezs from 'ezs';
import from from 'from';
import statements from './index';

ezs.use(statements);

describe('JSONLDString', () => {
    it('should export turtle RDF', (done) => {
        from([{
            'http://schema.org/name': 'Manu Sporny',
            'http://schema.org/url': { '@id': 'http://manu.sporny.org/' },
            'http://schema.org/image': { '@id': 'http://manu.sporny.org/images/manu.png' },
        }])
            .pipe(ezs('JSONLDString'))
            .pipe(ezs((output) => {
                try {
                    expect(output).toBe(
                        '_:b0 <http://schema.org/image> <http://manu.sporny.org/images/manu.png> .\n' +
                        '_:b0 <http://schema.org/name> "Manu Sporny" .\n' +
                        '_:b0 <http://schema.org/url> <http://manu.sporny.org/> .\n',
                    );
                    done();
                } catch (e) {
                    done(e);
                }
            }));
    });
});
