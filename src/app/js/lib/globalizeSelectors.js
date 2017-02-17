import { adjust, curryN, length, map } from 'ramda';

const globalize = transform => selector =>
    curryN(length(selector),
        (...args) => selector(...adjust(transform, -1, args)),
    );

export default (localStateTransform, selectors) =>
    map(globalize(localStateTransform), selectors);
