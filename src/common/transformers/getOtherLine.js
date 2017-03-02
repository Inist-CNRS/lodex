export default (context, targetColumn) =>
    async prev =>
        context.fetchLineBy(targetColumn, prev);
