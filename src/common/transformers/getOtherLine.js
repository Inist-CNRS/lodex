export default (context, targetColumn) =>
    async (prev) => {
        if (targetColumn) {
            return context.fetchLineBy(targetColumn, prev);
        }

        return null;
    };
