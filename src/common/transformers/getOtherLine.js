export default (context, targetColumn) =>
    (prev) => {
        if (targetColumn) {
            return context.fetchLineBy(targetColumn, prev);
        }

        return null;
    };
