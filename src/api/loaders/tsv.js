import ezs from 'ezs';
import ezsBasics from 'ezs-basics';

ezs.use(ezsBasics);

export default config => stream =>
    stream
        .pipe(
            ezs('CSVParse', {
                separator: '\t',
                quote: '\b',
                ...config,
            }),
        )
        .pipe(ezs('CSVObject'));
