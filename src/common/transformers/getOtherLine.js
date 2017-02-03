import fetchLineBy from '../../app/js/lib/fetchLineBy';

export default (context, targetColumn) => async (prev) => {
    if (context.env === 'node') {
        return context.dataset.findBy(targetColumn, prev);
    }

    return fetchLineBy(targetColumn, prev, context.token);
};
