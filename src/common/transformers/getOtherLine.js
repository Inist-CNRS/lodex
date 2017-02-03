import fetchLineBy from '../../app/js/lib/fetchLineBy';

export default (context, targetColumn) => async (prev) => {
    if (context.env === 'node') {
        return context.db.dataset.findBy(targetColumn, prev);
    }

    return fetchLineBy(targetColumn, prev, context.token);
};
