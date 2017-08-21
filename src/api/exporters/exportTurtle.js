import ezs from 'ezs';
import N3 from 'n3';
import ezsBasics from 'ezs-basics';
import ezsLocals from '../statements';

ezs.use(ezsBasics);
ezs.use(ezsLocals);

const exporter = (config, fields, characteristics, stream) =>
    stream
        .pipe(ezs('filterVersions'))
        .pipe(ezs('filterContributions', { fields }))
        .pipe(ezs('JSONLDObject', { fields, collectionClass: config.collectionClass }))
        .pipe(ezs('linkDataset', {
            uri: config.cleanHost,
            scheme: config.schemeForDatasetLink,
        }))
        .pipe(ezs('JSONLDString'))
        .pipe(ezs('bufferify'))
        .pipe(N3.StreamParser({ format: 'N-Quads' }))
        .pipe(new N3.StreamWriter({
            prefixes: config.prefixes,
        }));

exporter.extension = 'ttl';
exporter.mimeType = 'text/turtle';
exporter.type = 'file';
exporter.label = 'turtle';

export default exporter;
