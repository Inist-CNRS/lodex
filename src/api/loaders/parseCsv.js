import parseCsv from 'csv-parse';

export const parseCsvFactory = parseCsvImpl => () => stream =>
    stream.pipe(
        parseCsvImpl({
            columns: true,
            quote: '"',
            delimiter: ';',
        }),
    );

export default parseCsvFactory(parseCsv);
