import { createSelector } from 'reselect';

// @ts-expect-error TS7006
export const getProps = (state, props) => props;

// @ts-expect-error TS7006
export const createGlobalSelector = (getLocalState, selector) =>
    createSelector(getLocalState, getProps, (localState, props) =>
        selector(localState, props),
    );

// @ts-expect-error TS7006
export const createGlobalSelectors = (getLocalState, selectors) =>
    Object.keys(selectors).reduce(
        (result, key) => ({
            ...result,
            [key]: createGlobalSelector(getLocalState, selectors[key]),
        }),
        {},
    );
