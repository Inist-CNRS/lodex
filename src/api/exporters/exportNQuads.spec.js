import expect from 'expect';
import ezs from 'ezs';
import from from 'from';
import exportNQuads from './exportNQuads';

const fields = [{
    cover: 'collection',
    scheme: 'http://purl.org/dc/terms/title',
    format: {
        name: 'None',
    },
    name: 'Q98n',
}, {
    cover: 'collection',
    label: 'est une sous-partie de',
    scheme: 'http://purl.org/dc/terms/isPartOf',
    name: 'vlM0',
    classes: [
        'https://data.istex.fr/ontology/istex#PublicationTypeConcept',
    ],
}];

describe('export Nquads', () => {
    it('should export a single data property', (done) => {
        let outputString = '';
        exportNQuads(
            {
                cleanHost: '',
                schemeForDatasetLink: '',
            },
            fields.slice(0, 1),
            null,
            from([{ uri: 'http://data.istex.fr', Q98n: 'Terminator' }]),
        ).pipe(ezs((data, feed) => {
            if (data !== null) {
                outputString += data;
            } else {
                try {
                    expect(outputString).toEqual('<http://data.istex.fr> <http://purl.org/dc/terms/title> "Terminator" .\n');
                } catch (e) {
                    return done(e);
                }
                return done();
            }
            return feed.end();
        }));
    });

    it('should export an object property (with a class)', (done) => {
        let outputString = '';
        exportNQuads(
            {
                cleanHost: 'https://lodex.data.istex.fr',
                schemeForDatasetLink: '',
                '@context': {
                    vlM0: { '@id': 'http://purl.org/dc/terms/isPartOf' },
                },
            },
            fields.slice(1, 2),
            null,
            from([{
                uri: 'http://data.istex.fr/1',
                D0n9: 'https://publication-type.data.istex.fr/ark:/67375/JMC-0GLKJH51-B' }]),
        ).pipe(ezs((data, feed) => {
            if (data !== null) {
                outputString += data;
            } else {
                try {
                    expect(outputString).toEqual(`<http://data.istex.fr/1/classes/vlM0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://data.istex.fr/ontology/istex#PublicationTypeConcept> .
<http://data.istex.fr/1> <http://purl.org/dc/terms/isPartOf> <http://data.istex.fr/1/classes/vlM0> .
<http://data.istex.fr/1> <http://purl.org/dc/terms/isPartOf> <https://lodex.data.istex.fr> .
`);
                } catch (e) {
                    return done(e);
                }
                return done();
            }
            return feed.end();
        }));
    });
});
