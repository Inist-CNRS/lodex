import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
import ezsLocals from '../statements';

ezs.use(ezsBasics);
ezs.use(ezsLocals);

const exporter = (config, fields, characteristics, stream) =>
    stream
        .pipe(ezs('filterVersions'))
        .pipe(ezs('filterContributions', { fields }))
        .pipe(ezs('MinimalObject', { fields }))
        .pipe(ezs('jsonify'));

exporter.extension = 'js';
exporter.mimeType = 'application/json';
exporter.type = 'file';
exporter.label = 'min';

export default exporter;
