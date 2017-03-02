export default (array, separator) =>
    array.reduce((acc, item, index) => {
        if (index !== array.length - 1) {
            return acc.concat(item).concat(separator);
        }

        return acc.concat(item);
    }, []);
