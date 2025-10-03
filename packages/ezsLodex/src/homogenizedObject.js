const getSourceError = (error) => {
    const sourceError = error?.sourceError;
    if (sourceError?.sourceError) {
        return getSourceError(sourceError);
    }
    return error;
};

function homogenizedObject(data, feed) {
    if (this.isLast()) {
        return feed.close();
    }

    if (data.scope && data.stack) {
        // Erreur serializée par [catch]
        const error = getSourceError(data);
        let sourceChunk = null;
        if (error?.sourceChunk) {
            try {
                sourceChunk = JSON.parse(error.sourceChunk);
            } catch (e) {
                feed.stop(
                    new Error(`Error while parsing sourceChunk (${e.message}`),
                );
            }
        }
        // try to obtain only the lodash error message
        const errorMessage =
            Array()
                .concat(error?.traceback)
                .filter((x) => x.search(/Error:/) >= 0)
                .shift() || error?.message;

        return feed.send({
            id: sourceChunk?.id,
            value: errorMessage, // for the preview
            error: errorMessage, // for the log
        });
    }

    let value;
    if (data.error) {
        value = `[Error]: ${data.error}`;
    } else if (data.value !== undefined && data.value !== null) {
        value = data.value;
    } else {
        value = 'n/a';
    }
    feed.send({ id: data.id, value, error: data.error });
}
export default {
    homogenizedObject,
};
