export default ctx => (fieldName, value) => (
    value
        ? ctx.dataset
            .findBy(fieldName, value)
            .then(line => (
                line
                    ? ({
                        ...line,
                        uri: `uri to ${fieldName}: ${value}`,
                    })
                    : null),
            )
        : null);
