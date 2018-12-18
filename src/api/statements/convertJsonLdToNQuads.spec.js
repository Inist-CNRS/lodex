import ezs from 'ezs';
import from from 'from';
import testOne from './testOne';

const statements = require('.');
ezs.use(statements);

describe('convertJSonLdToNquads', () => {
    it(
        'should convert a correct JSON-LD into NQuads',
        done => {
            // see https://json-ld.org/playground/ for the Person example
            const stream = from([
                {
                    '@context': 'http://schema.org/',
                    '@graph': [
                        {
                            id: 'http://uri/janedoe',
                            type: 'Person',
                            jobTitle: 'Professor',
                            name: 'Jane Doe',
                            telephone: '(425) 123-4567',
                            url: 'http://www.janedoe.com',
                        },
                    ],
                },
            ]).pipe(ezs('convertJsonLdToNQuads'));
            const expectedNquads = [
                '<http://uri/janedoe> <http://schema.org/jobTitle> "Professor" .',
                '<http://uri/janedoe> <http://schema.org/name> "Jane Doe" .',
                '<http://uri/janedoe> <http://schema.org/telephone> "(425) 123-4567" .',
                '<http://uri/janedoe> <http://schema.org/url> <http://www.janedoe.com> .',
                '<http://uri/janedoe> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://schema.org/Person> .',
            ];
            testOne(
                stream,
                data => {
                    const lines = data.split('\n');
                    expect(expectedNquads).toContain(lines[0]);
                    expect(expectedNquads).toContain(lines[1]);
                    expect(expectedNquads).toContain(lines[2]);
                    expect(expectedNquads).toContain(lines[3]);
                    expect(expectedNquads).toContain(lines[4]);
                },
                done,
            );
        },
        8000,
    );
});
