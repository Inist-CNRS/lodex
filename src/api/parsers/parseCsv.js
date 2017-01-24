import parseCsv from 'csv-parse/lib/sync';
import rxNode from 'rx-node';
import split from 'split';
import config from 'config';

export const arrayToObject = (keys, values) => {
    if (!values && !values.length) {
        throw new Error('Empty line');
    }
    if (values.length > keys.length) {
        throw new Error('There is more values than columns');
    }
    return keys.reduce((acc, key, index) => ({
        ...acc,
        [key || `col${index + 1}`]: values[index],
    }), {});
};

export default stream =>
new Promise((resolve, reject) => {
    const splittedStream = stream
    .pipe(split(/(?:\r?\n)(?=(?:[^"\\]*(?:\\.|"(?:[^"\\]*\\.)*[^"\\]*"))*[^"]*$)/g));

    const observable = rxNode.fromStream(splittedStream);
    const column$ = observable.take(1)
    .map((v) => {
        try {
            return parseCsv(v, config.csv)[0];
        } catch (error) {
            return reject(error);
        }
    });

    let totalFailedLines = 0;
    let totalParsedLines = 0;
    const errors = [];
    const documents = [];

    observable
    .combineLatest(column$, (line, columns) => {
        try {
            const parsedLine = parseCsv(line.trim(), config.csv)[0];
            return {
                document: arrayToObject(columns, parsedLine),
            };
        } catch (error) {
            return {
                error,
                data: line,
            };
        }
    })
    .map((v, i) => ({
        ...v,
        line: i + 1,
    }))
    .filter(v => v.line !== 1)
    .subscribe(
        (value) => {
            try {
                if (value.error) {
                    totalFailedLines += 1;
                    if (errors.length < 5) {
                        errors.push({ ...value, error: value.error.message });
                    }
                    return;
                }
                totalParsedLines += 1;
                documents.push(value.document);
            } catch (error) {
                reject(error);
            }
        },
        reject,
        () => resolve({
            documents,
            parsingData: {
                totalFailedLines,
                totalParsedLines,
                totalLoadedLines: totalFailedLines + totalParsedLines,
                errors,
            },
        }),
    );
});
