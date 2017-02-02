import dataset from '../../api/models/dataset';
import fetchLineBy from '../../app/js/lib/fetchLineBy';

export default (context, targetColumn) => async (prev) => {
    if (context.env === 'node') {
        return dataset.findBy({ [targetColumn]: prev });
    }

    return fetchLineBy(targetColumn, prev, context.token);
};
