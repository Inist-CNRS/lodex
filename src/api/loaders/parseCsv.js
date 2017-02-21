import parseCsv from 'csv-parse';

export default config => stream =>
    new Promise((resolve, reject) =>
        stream.pipe(parseCsv({
            columns: true,
            ...config,
        }, (error, data) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(data);
        })),
    );
