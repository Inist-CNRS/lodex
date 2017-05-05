import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
import ezsLocals from './ezsLocals';

ezs.use(ezsBasics);
ezs.use(ezsLocals);

const exporter = (config, fields, characteristics, stream) =>
    stream
        .pipe(ezs('filterVersions'))
        .pipe(ezs('filterContributions', { fields }))
        .pipe(ezs('useFieldNames', { fields }))
        .pipe(ezs('CSVString', { separator: '\t' }));

exporter.extension = 'tsv';
exporter.mimeType = 'text/tab-separated-values';
exporter.type = 'file';
exporter.label = 'tsv';

export default exporter;
