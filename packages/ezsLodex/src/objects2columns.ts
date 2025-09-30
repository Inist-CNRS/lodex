/**
 * Take an `Object` and flatten it to get only one level of keys.
 *
 * <caption>Input:</caption>
 *
 * ```json
 * [{
 *   "foo": {
 *     "hello": "world"
 *   },
 *   "bar": "anything else",
 *   "baz": 1
 * }]
 * ```
 *
 * <caption>Output:</caption>
 *
 * ```json
 * [{
 *   "foo": "{\"hello\":\"world\"}",
 *   "bar": "anything else",
 *   "baz": 1
 * }]
 * ```
 *
 * @name objects2columns
 * @alias flatten
 * @param {undefined} none
 * @returns {Object}
 */
export default function objects2columns(this: any, data: any, feed: any) {
    if (this.isLast()) {
        feed.close();
        return;
    }
    const obj = {};
    Object.keys(data)
        .sort((x, y) => x.localeCompare(y))
        .forEach((key) => {
            if (typeof data[key] === 'object') {
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                obj[key] = JSON.stringify(data[key]);
            } else {
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                obj[key] = data[key];
            }
        });
    feed.send(obj);
}
