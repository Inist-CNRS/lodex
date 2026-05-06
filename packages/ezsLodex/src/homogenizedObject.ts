const formatError = (e: Error) => {
    const newmsg = String(e.message).replace(/Error: /, '');
    return `[Error]: ${newmsg}`; // Lodex uses this label to recognize errors
};

function homogenizedObject(this: any, data: any, feed: any) {
    if (this.isLast()) {
        return feed.close();
    }
    let id = data?.id;
    let value;
    let error;
    if (data instanceof Error) {
        id = 'n/a';
        value = formatError(data);
        error = data;
    } else if (data?.value instanceof Error) {
        value = formatError(data.value);
        error = data.value;
    } else if (data.error) {
        value = formatError(data.error);
        error = data.error;
    } else if (data.value !== undefined && data.value !== null) {
        value = data.value;
    } else {
        value = 'n/a';
    }
    feed.send({ id, value, error });
}
export default {
    homogenizedObject,
};
