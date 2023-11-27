import get from 'lodash.get';

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
 *  .pipe(ezs('LodexExtractOutput', { extract: 'total' }))
 *
 * @example <caption>Output</caption>
 * {
 *     total: 2
 * }
 *
 * @name LodexOutput
 * @param {boolean}  [indent=false]  indent or not
 * @param {string[]} [extract]       fields to put at the root of the output
 *                                   object
 * @returns {string}
 */
function LodexExtractOutput(data, feed) {
    const indent = this.getParam('indent', false);
    const extract = this.getParam('extract');
    const extracts = Array.isArray(extract) ? extract : [extract];
    const keys = extracts.filter(x => x);

    const json = d => JSON.stringify(d, null, indent ? 4 : null);

    if (this.isLast()) {
        feed.write('}\n');
        return feed.close();
    }
    if (this.isFirst() && !this.isLast()) {
        const values = keys.map(p => get(data, p));
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
        }
    } else {
        feed.write(',\n');
    }
    return feed.end();
}
export default LodexExtractOutput;
