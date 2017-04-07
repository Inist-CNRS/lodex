import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
import * as ezsLocals from './ezsLocals';

ezs.use(ezsBasics);
ezs.use(ezsLocals);

const exporter = (config, fields, characteristics, stream) =>
    stream
        .pipe(ezs('filterVersions'))
        .pipe(ezs('filterContributions', { fields }))
        .pipe(ezs('JSONLDObject', { fields }))
        .pipe(ezs('linkDataset', {
            uri: 'http://lod.istex.fr/',
            scheme: 'http://www.w3.org/2004/02/skos/core#inScheme',
        }))
        .pipe(ezs('JSONLDString'));

exporter.extension = 'nq';
exporter.mimeType = 'application/n-quads';
exporter.type = 'file';

export default exporter;
