import config from 'config';
// @ts-expect-error TS7016
import ezs from '@ezs/core';
import { PassThrough } from 'stream';

const generateScript = (fields: any): string =>
    fields.reduce((scriptTmp: string, field: any) => {
        const stmt = field.transformers.reduce((prev: string, cur: any) => {
            const stmtName = `${prev}\n[$${cur.operation}]\nfield=${field.name}\n`;
            if (!Array.isArray(cur.args)) {
                return stmtName;
            }
            const res = cur.args.reduce(
                (stmtString: string, arg: any) =>
                    `${stmtString}${arg.name} = fix(${JSON.stringify(arg.value)})\n`,
                stmtName,
            );
            return res;
        }, '');
        return `${scriptTmp}${stmt}`;
    }, '');

export default (
    fields: any,
    fusible: string,
    environment: any,
    onDataPublished: any,
) =>
    new Promise((resolve, reject) => {
        const rules = generateScript(fields);
        const BATCH_SIZE = 10;
        const script = `
        [use]
plugin = lodex
plugin = transformers

[paginateQuery]
collection = fix('dataset')

[breaker]
fusible = ${fusible}

${rules}

[catch]
stop = false

[replace]
path = uri
value = get('uri')
path = lastVersion
value = self().omit(['$origin', 'uri'])
path = publicationDate
value = fix(new Date())

[assign]
path = versions
value = get('lastVersion').castArray()
path = hiddenResource
value = env('hiddenResources').castArray().find((hidden) => hidden.uri === self.uri)

[group]
length = ${BATCH_SIZE}

# Ensures that EZS does not write to the database if the job has been canceled
[breaker]
fusible = ${fusible}

[LodexInsertDocuments]
collection = fix('publishedDataset')

[breaker]
fusible = ${fusible}

[ungroup]
    `;
        console.error({ script });
        const primer = {};
        const errorCount = 0;
        const input = new PassThrough({ objectMode: true });
        input
            .pipe(
                ezs(
                    config.get('ezs.mainStatement.publish'),
                    { script },
                    environment,
                ),
            )
            .on('data', onDataPublished)
            .on('end', () => resolve(errorCount))
            .on('error', (error: any) => {
                error.errorCount = errorCount;
                reject(error);
            });
        input.end(primer);
    });
