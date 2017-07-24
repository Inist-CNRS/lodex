import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
import ezsLocals from '../statements';

ezs.use(ezsBasics);
ezs.use(ezsLocals);


const exporter = (config, fields, characteristics, stream) =>
    stream
        .pipe(ezs('jsonify'));

exporter.extension = 'json';
exporter.mimeType = 'application/json';
exporter.type = 'file';
exporter.label = 'raw';

export default exporter;
