export default (context, targetColumn) => async (prev) => {
    if (context.env === 'node') {
        return context.dataset.findBy(targetColumn, prev);
    }

    return context.fetchLineBy(targetColumn, prev);
};
