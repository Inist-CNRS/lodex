import ezs from 'ezs';
import ezsBasics from 'ezs-basics';

ezs.use(ezsBasics);

export default config => stream =>
    stream
        .pipe(ezs('XMLParse', { separator: ["/RDF/*", "/rdf:RDF/*"],  ...config }))
        .pipe(ezs('SKOSObject'))
        .pipe(ezs('standardize'))
;
