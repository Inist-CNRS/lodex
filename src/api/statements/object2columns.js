export default function object2columns(data, feed) {
    if (this.isLast()) {
        feed.close();
        return;
    }
    const obj = {};
    Object.keys(data)
        .sort((x, y) => x.localeCompare(y))
        .forEach(key => {
            if (Array.isArray(data[key]) || typeof data[key] === 'object') {
                obj[key] = JSON.stringify(data[key]);
            } else {
                obj[key] = data[key];
            }
        });
    feed.send(obj);
}
