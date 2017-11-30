import ezs from 'ezs';
import ezsBasics from 'ezs-basics';

ezs.use(ezsBasics);

/**
 * Loader parsing CSV, with tabulation as separator, and double quote (") as
 * escape character (so, it's a TSV loader, using " to escape cells with special
 * characters, such as \n, \t, ...)
 */
export default config => stream =>
    stream
        .pipe(
            ezs('CSVParse', {
                separator: '\t',
                quote: '"',
                ...config,
            }),
        )
        .pipe(ezs('CSVObject'));
