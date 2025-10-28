import omit from 'lodash/omit';
import { combineActions, createAction, handleActions } from 'redux-actions';

import {
    createActionTypes as createFacetValueActionTypes,
    createActions as createFacetValueActions,
    createReducer as createFacetValueReducer,
} from './facetValueReducer';

import { isFacetValuesChecked } from './selectors';

import { SAVE_RESOURCE_SUCCESS } from '../resource';

export const initialState = {
    error: null,
    appliedFacets: {},
    facetsValues: {},
    openedFacets: {},
    invertedFacets: {},
};

// @ts-expect-error TS7006
export const createActionTypes = (prefix) => ({
    OPEN_FACET: `${prefix}_OPEN_FACET`,
    TOGGLE_FACET_VALUE: `${prefix}_TOGGLE_FACET_VALUE`,
    CLEAR_FACET: `${prefix}_CLEAR_FACET`,
    LOAD_FACET_VALUES: `${prefix}_LOAD_FACET_VALUES`,
    LOAD_FACET_VALUES_ERROR: `${prefix}_LOAD_FACET_VALUES_ERROR`,
    INVERT_FACET: `${prefix}_INVERT_FACET`,
    SET_FACETS: `${prefix}_SET_FACETS`,
    SET_ALL_VALUE_FOR_FACET: `${prefix}_SET_ALL_VALUE_FOR_FACET`,
    ...createFacetValueActionTypes(prefix),
});

// @ts-expect-error TS7006
export const createActions = (actionTypes) => ({
    openFacet: createAction(actionTypes.OPEN_FACET),
    toggleFacetValue: createAction(actionTypes.TOGGLE_FACET_VALUE),
    clearFacet: createAction(actionTypes.CLEAR_FACET),
    loadFacetValues: createAction(actionTypes.LOAD_FACET_VALUES),
    loadFacetValuesError: createAction(actionTypes.LOAD_FACET_VALUES_ERROR),
    invertFacet: createAction(actionTypes.INVERT_FACET),
    setFacets: createAction(actionTypes.SET_FACETS),
    setAllValueForFacet: createAction(actionTypes.SET_ALL_VALUE_FOR_FACET),
    ...createFacetValueActions(actionTypes),
});

// @ts-expect-error TS7006
export const createReducer = (prefix) => {
    const actionTypes = createActionTypes(prefix);
    const actions = createActions(actionTypes);

    const facetValuesReducer = createFacetValueReducer(actionTypes);

    const reducer = handleActions(
        {
            // @ts-expect-error TS7006
            [actionTypes.OPEN_FACET]: (state, { payload: { name } }) => ({
                ...state,
                openedFacets: {
                    ...state.openedFacets,
                    // @ts-expect-error TS7053
                    [name]: !state.openedFacets[name],
                },
            }),
            [actionTypes.LOAD_FACET_VALUES_ERROR]: (
                state,
                { payload: error },
            ) => ({
                ...state,
                // @ts-expect-error TS2345
                error: error.message || error,
            }),
            [actionTypes.TOGGLE_FACET_VALUE]: (
                { appliedFacets, ...state },
                // @ts-expect-error TS7031
                { payload: { name, facetValue } },
            ) => {
                const isChecked = isFacetValuesChecked(
                    { appliedFacets },
                    { name, facetValue },
                );
                // @ts-expect-error TS7053
                const prevValues = appliedFacets[name] || [];

                const newValues = isChecked
                    ? // @ts-expect-error TS7006
                      prevValues.filter((v) => v.value !== facetValue.value)
                    : prevValues.concat(facetValue);

                if (!newValues.length) {
                    return {
                        ...state,
                        appliedFacets: omit(appliedFacets, name),
                    };
                }
                return {
                    ...state,
                    appliedFacets: {
                        ...appliedFacets,
                        [name]: newValues,
                    },
                };
            },
            [actionTypes.SET_ALL_VALUE_FOR_FACET]: (
                { appliedFacets, ...state },
                // @ts-expect-error TS7031
                { payload: { name, values } },
            ) => {
                return {
                    ...state,
                    appliedFacets: {
                        ...appliedFacets,
                        //  @ts-expect-error TS7053
                        [name]: appliedFacets[name]
                            ? // @ts-expect-error TS7006
                              [...new Set([...appliedFacets[name], ...values])]
                            : values,
                    },
                };
            },
            [actionTypes.CLEAR_FACET]: (
                { appliedFacets, invertedFacets, ...state },
                { payload: name },
            ) => {
                if (!name) {
                    return {
                        ...state,
                        appliedFacets: {},
                        invertedFacets: {},
                    };
                }
                return {
                    ...state,
                    // @ts-expect-error TS7053
                    appliedFacets: omit(appliedFacets, name),
                    // @ts-expect-error TS7053
                    invertedFacets: omit(invertedFacets, name),
                };
            },
            [actionTypes.INVERT_FACET]: (
                { invertedFacets, ...state },
                // @ts-expect-error TS7031
                { payload: { name, inverted } },
            ) => ({
                ...state,
                invertedFacets: inverted
                    ? { ...invertedFacets, [name]: true }
                    : omit(invertedFacets, name),
            }),
            // @ts-expect-error TS7006
            [combineActions(
                actionTypes.LOAD_FACET_VALUES_SUCCESS,
                actionTypes.FACET_VALUE_CHANGE,
                actionTypes.FACET_VALUE_SORT,
                // @ts-expect-error TS7006
            )]: (state, action) => {
                const name = action.payload.name;

                return {
                    ...state,
                    facetsValues: {
                        ...state.facetsValues,
                        [name]: facetValuesReducer(
                            state.facetsValues[name],
                            action,
                        ),
                    },
                };
            },
            [SAVE_RESOURCE_SUCCESS]: (state) => ({
                ...state,
                openedFacets: {},
            }),
            [actionTypes.SET_FACETS]: (
                state,
                {
                    payload: {
                        facetsValues,
                        appliedFacets,
                        invertedFacets,
                        openedFacets,
                    },
                },
            ) => ({
                ...state,
                facetsValues,
                appliedFacets,
                invertedFacets,
                openedFacets,
            }),
        },
        initialState,
    );

    return {
        actionTypes,
        actions,
        reducer,
    };
};

export default createReducer;
