export default (array, key) => ({
    catalog: array.reduce((acc, item) => ({
        ...acc,
        [item[key]]: item,
    }), {}),
    list: array.map(({ [key]: value }) => value),
});
