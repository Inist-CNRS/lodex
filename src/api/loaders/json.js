import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
import ezsLocals from '../statements';

ezs.use(ezsBasics);
ezs.use(ezsLocals);

export default config => stream =>
    stream
        .pipe(ezs('JSONParse', { separator: '*', ...config }))
        .pipe(ezs('objects2columns'))
        .pipe(ezs('standardize'));
