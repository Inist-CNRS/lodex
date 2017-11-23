import memoize from 'lodash.memoize';

export default transformer => {
    const fn = (context, args) =>
        memoize(transformer(context, args), doc => (doc._id ? doc._id : JSON.stringify(doc))); // eslint-disable-line

    const memoizedFn = memoize(fn, (_, args) => JSON.stringify(args));
    memoizedFn.getMetas = transformer.getMetas;

    return memoizedFn;
};
