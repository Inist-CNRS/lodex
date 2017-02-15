export default ctx => (fieldName, value) =>
    ctx.dataset
        .findBy(fieldName, value)
        .then(line => ({
            ...line,
            uri: `uri to ${fieldName}: ${value}`,
        }))
        .catch(() => null);
