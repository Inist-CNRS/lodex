import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
import * as ezsLocals from './ezsLocals';

ezs.use(ezsBasics);
ezs.use(ezsLocals);


export default (fields, characteristics, stream) =>
    stream
        .pipe(ezs('jsonify'));
