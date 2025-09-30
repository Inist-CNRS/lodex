function flattenPatch(this: any, data: any, feed: any) {
    if (this.isLast()) {
        feed.close();
        return;
    }
    const obj = {};
    Object.keys(data)
        .sort((x, y) => x.localeCompare(y))
        .forEach((key) => {
            const val = Array.isArray(data[key])
                ? data[key].join(';')
                : data[key];
            if (key.match(/\/[0-9]+$/)) {
                const newkey = key.replace(/(\/[0-9]+$)/, '');
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                if (obj[newkey]) {
                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    obj[newkey] += `;${val}`;
                } else {
                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    obj[newkey] = val;
                }
            } else {
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                obj[key] = val;
            }
        });
    feed.send(obj);
}

/**
 * Take `Object` and transform all key ending byu number on array.
 *
 * @name flattenPatch
 * @alias flatten
 * @param {undefined} none
 * @returns {Object}
 */
export default {
    flattenPatch,
};
