import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
import ezsLocals from '../statements';

ezs.use(ezsBasics);
ezs.use(ezsLocals);

ezs.use(ezsBasics);

export default config => stream =>
    stream
        .pipe(ezs('JSONParse', { separator: 'hits.*', ...config }))
        .pipe(ezs('flatten'))
        .pipe(ezs('fixFlatten'))
        .pipe(ezs('standardize'));
