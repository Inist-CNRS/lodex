import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
import ezsLocals from '../statements';

ezs.use(ezsBasics);
ezs.use(ezsLocals);

const exporter = (config, fields, characteristics, stream) =>
    stream
        .pipe(ezs('filterVersions'))
        .pipe(ezs('filterContributions', { fields }))
        .pipe(ezs('JSONLDObject', { fields }))
        .pipe(ezs('linkDataset', {
            uri: config.cleanHost,
            scheme: config.schemeForDatasetLink,
        }))
        .pipe(ezs('JSONLDCompacter'))
        .pipe(ezs('jsonify'));

exporter.extension = 'json';
exporter.mimeType = 'application/json';
exporter.type = 'file';
exporter.label = 'jsonldcompacted';

export default exporter;

