import parseCsv from 'csv-parse';
import config from 'config';

export default stream =>
new Promise((resolve, reject) =>
    stream.pipe(parseCsv({
        columns: true,
        ...config.csv,
    }, (error, data) => {
        if (error) {
            reject(error);
            return;
        }
        resolve(data);
    })),
);
