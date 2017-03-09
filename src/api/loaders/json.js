import ezs from 'ezs';
import ezsBasics from 'ezs-basics';

ezs.use(ezsBasics);

export default config => stream =>
    stream
    .pipe(ezs('JSONParse', { separator: '*', ...config }))
    .pipe(ezs('flatten'))
    .pipe(ezs('standardize'));
