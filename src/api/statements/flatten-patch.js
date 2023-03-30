function flattenPatch(data, feed) {
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
                if (obj[newkey]) {
                    obj[newkey] += `;${val}`;
                } else {
                    obj[newkey] = val;
                }
            } else {
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
