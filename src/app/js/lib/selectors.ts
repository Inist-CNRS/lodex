import { createSelector } from 'reselect';
import type { State } from '../../../../packages/admin-app/src/reducers';

// @ts-expect-error TS7006
export const getProps = (state, props) => props;

// @ts-expect-error TS7006
export const createGlobalSelector = (getLocalState, selector) =>
    createSelector(getLocalState, getProps, (localState, props) =>
        selector(localState, props),
    );

export const createGlobalSelectors = <
    T extends Record<string, (localState: any, props?: any) => any>,
    LocalState = any,
    Props = any,
>(
    getLocalState: (state: State) => LocalState,
    selectors: T,
): {
    [K in keyof T]: (state: State, props?: Props) => ReturnType<T[K]>;
} =>
    Object.keys(selectors).reduce(
        (result, key) => ({
            ...result,
            [key]: createGlobalSelector(getLocalState, selectors[key]),
        }),
        {} as any,
    );
