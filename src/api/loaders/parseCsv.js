import parseCsv from 'csv-parse';

export const parseCsvFactory = parseCsvImpl => config => stream =>
    stream.pipe(parseCsvImpl({
        columns: true,
        ...config,
    }));

export default parseCsvFactory(parseCsv);
