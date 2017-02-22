import { createSelector } from 'reselect';

export const getProps = (state, props) => props;

export const createGlobalSelector = (getLocalState, selector) => createSelector(
    getLocalState,
    getProps,
    (localState, props) => selector(localState, props),
);

export const createGlobalSelectors = (getLocalState, selectors) => Object.keys(selectors).reduce((result, key) => ({
    ...result,
    [key]: createGlobalSelector(getLocalState, selectors[key]),
}), {});
