import memoize from 'lodash.memoize';

const ensure = collection => async (fieldName) => {
    const count = await collection.count();
    const distinct = await collection.distinct(fieldName);

    return distinct.length === count;
};

export default collection => memoize(ensure(collection));
