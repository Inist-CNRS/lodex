import from from 'from';
import ezs from '@ezs/core';
import statements from '../src';

ezs.use(statements);

describe('JSONLDCompacter', () => {
    it('should return compacted JSON-LD', (done) => {
        from([
            [
                {
                    '@type': ['http://schema.org/Person'],
                    'http://schema.org/jobTitle': [{
                        '@value': 'Professor',
                    }],
                    'http://schema.org/name': [{
                        '@value': 'Jane Doe',
                    }],
                    'http://schema.org/telephone': [{
                        '@value': '(425) 123-4567',
                    }],
                    'http://schema.org/url': [{
                        '@id': 'http://www.janedoe.com',
                    }],
                },
            ],
        ])
            .pipe(ezs('JSONLDCompacter'))
            .pipe(ezs((output) => {
                try {
                    expect(output).toEqual({
                        '@type': 'http://schema.org/Person',
                        'http://schema.org/jobTitle': 'Professor',
                        'http://schema.org/name': 'Jane Doe',
                        'http://schema.org/telephone': '(425) 123-4567',
                        'http://schema.org/url': {
                            '@id': 'http://www.janedoe.com',
                        },
                    });
                    done();
                } catch (e) {
                    done(e);
                }
            }));
    });

    it('should return empty object when input is empty', (done) => {
        from([
            [
            ],
        ])
            .pipe(ezs('JSONLDCompacter'))
            .pipe(ezs((output) => {
                expect(output).toEqual({
                });
                done();
            }));
    });
});
