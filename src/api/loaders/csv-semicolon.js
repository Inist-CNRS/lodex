import ezs from 'ezs';
import ezsBasics from 'ezs-basics';

ezs.use(ezsBasics);

export default () => stream =>
    stream
        .pipe(
            ezs('CSVParse', {
                separator: ';',
                quote: '"',
            }),
        )
        .pipe(ezs('CSVObject'));
