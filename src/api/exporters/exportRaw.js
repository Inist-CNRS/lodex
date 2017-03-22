import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
import * as ezsLocals from './ezsLocals';

ezs.use(ezsBasics);
ezs.use(ezsLocals);


const exporter = (fields, characteristics, stream) =>
    stream
        .pipe(ezs('jsonify'));

exporter.extension = 'json';
exporter.mimeType = 'application/json';

export default exporter;
