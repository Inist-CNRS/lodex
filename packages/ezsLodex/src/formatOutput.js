import get from 'lodash/get';
import unset from 'lodash/unset';
/**
 * Format the output in compliance with LODEX routines format.
 *
 * @example <caption>Input</caption>
 * [
 *      { _id: 1, value: 2, total: 2 },
 *      { _id: 2, value: 4, total: 2 }
 * ]
 *
 * @example <caption>Script</caption>
 *  .pipe(ezs('LodexOutput', { extract: 'total' }))
 *
 * @example <caption>Output</caption>
 * {
 *     data [
 *         { _id: 1, value: 2 },
 *         { _id: 2, value: 4 }
 *     ],
 *     total: 2
 * }
 *
 * @name LodexOutput
 * @param {string}   [keyName="data"]  name of the `data` property
 * @param {boolean}  [indent=false]  indent or not
 * @param {string[]} [extract]       fields to put at the root of the output
 *                                   object
 * @returns {string}
 */
function formatOutput(data, feed) {
    const keyName = this.getParam('keyName', 'data');
    const indent = this.getParam('indent', false);
    const extract = this.getParam('extract');
    const extracts = Array.isArray(extract) ? extract : [extract];
    const keys = extracts.filter((x) => x);

    const json = (d) => JSON.stringify(d, null, indent ? '    ' : null);

    if (this.isLast()) {
        feed.write(']}\n');
        return feed.close();
    }
    if (this.isFirst() && !this.isLast()) {
        const values = keys.map((p) => get(data, p));
        feed.write('{');
        if (keys.length > 0) {
            let check = false;
            keys.forEach((k, index) => {
                if (values[index]) {
                    feed.write(!check ? ' ' : ',');
                    check = true;
                    feed.write(json(k));
                    feed.write(':');
                    feed.write(json(values[index]));
                }
            });
            if (check) {
                feed.write(',');
            }
        }
        feed.write(`"${keyName}":[`);
    } else {
        feed.write(',\n');
    }
    keys.forEach((p) => unset(data, p));
    feed.write(json(data));
    return feed.end();
}
export default {
    formatOutput,
};
