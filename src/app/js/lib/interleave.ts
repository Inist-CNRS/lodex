// @ts-expect-error TS7006
export default (array, separator) =>
    // @ts-expect-error TS7006
    array.reduce((acc, item, index) => {
        if (index !== array.length - 1) {
            return acc.concat(item).concat(separator);
        }

        return acc.concat(item);
    }, []);
