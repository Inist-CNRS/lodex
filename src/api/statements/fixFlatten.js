export default function fixFlatten(data, feed) {
    if (this.isLast()) {
        feed.close();
        return;
    }
    const obj = {};
    Object.keys(data)
        .sort((x, y) => x.localeCompare(y))
        .forEach(key => {
            const val = Array.isArray(data[key])
                ? data[key].join(';')
                : data[key];
            if (val.length > 0) {
                if (key.match(/\/[0-9]+$/)) {
                    const newkey = key.replace(/(\/[0-9]+$)/, '');
                    if (obj[newkey]) {
                        obj[newkey] += ';' + val;
                    } else {
                        obj[newkey] = val;
                    }
                } else {
                    obj[key] = val;
                }
            }
        });
    feed.send(obj);
}
