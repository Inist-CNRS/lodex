import memoize from 'lodash.memoize';

export default (transformer) => {
    const fn = (context, args) => memoize(transformer(context, args), ({ _id }) => _id);

    const memoizedFn = memoize(fn, (_, args) => JSON.stringify(args));
    memoizedFn.getMetas = transformer.getMetas;

    return memoizedFn;
};
