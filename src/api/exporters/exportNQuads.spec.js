import expect from 'expect';
import ezs from 'ezs';
import from from 'from';
import exportNQuads from './exportNQuads';

const fields = [{
    cover: 'collection',
    label: 'title',
    transformers: [
        {
            operation: 'COLUMN',
            args: [
                {
                    name: 'column',
                    type: 'column',
                    value: 'title',
                },
            ],
        },
    ],
    scheme: 'http://purl.org/dc/terms/title',
    format: {
        name: 'None',
    },
    display_in_list: true,
    display_in_resource: true,
    searchable: true,
    position: 3,
    name: 'Q98n',
}, {
    cover: 'collection',
    label: 'Localisation de la ressource pédagogique',
    display_in_list: true,
    display_in_resource: true,
    searchable: true,
    transformers: [
        {
            operation: 'COLUMN',
            args: [
                {
                    name: 'column',
                    type: 'column',
                    value: 'Localisation de la ressource pédagogique',
                },
            ],
        },
    ],
    position: 2,
    scheme: 'http://data.opendiscoveryspace.eu/lom_ontology_ods.owl#technicalLocation',
    format: {
        name: 'link',
    },
    classes: [
        'http://data.opendiscoveryspace.eu/lom_ontology_ods.owl#LearningObject',
    ],
    name: 'ZI8w',
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

    it.only('should export an object property (with a class)', (done) => {
        let outputString = '';
        exportNQuads(
            {
                cleanHost: 'https://lodex.data.istex.fr',
                schemeForDatasetLink: '',
                '@context': {
                    ZI8w: { '@id': 'http://data.opendiscoveryspace.eu/lom_ontology_ods.owl#technicalLocation' },
                },
            },
            fields.slice(1, 2),
            null,
            from([{
                uri: 'http://data.istex.fr',
                ZI8w: 'A New Hope' }]),
        ).pipe(ezs((data, feed) => {
            if (data !== null) {
                outputString += data;
            } else {
                try {
                    expect(outputString).toEqual('<http://data.istex.fr> <http://purl.org/dc/terms/title> "A New Hope" .\n');
                } catch (e) {
                    return done(e);
                }
                return done();
            }
            return feed.end();
        }));
    });
});
