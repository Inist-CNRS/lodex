import omit from 'lodash.omit';
import { createAction, handleActions, combineActions } from 'redux-actions';

import {
    createActionTypes as createFacetValueActionTypes,
    createActions as createFacetValueActions,
    createReducer as createFacetValueReducer,
} from './facetValueReducer';

import { isFacetValuesChecked } from './selectors';

import { SAVE_RESOURCE_SUCCESS } from '../resource/index';

export const initialState = {
    error: null,
    appliedFacets: {},
    facetsValues: {},
    openedFacets: {},
    invertedFacets: {},
};

export const createActionTypes = prefix => ({
    OPEN_FACET: `${prefix}_OPEN_FACET`,
    TOGGLE_FACET_VALUE: `${prefix}_TOGGLE_FACET_VALUE`,
    CLEAR_FACET: `${prefix}_CLEAR_FACET`,
    LOAD_FACET_VALUES: `${prefix}_LOAD_FACET_VALUES`,
    LOAD_FACET_VALUES_ERROR: `${prefix}_LOAD_FACET_VALUES_ERROR`,
    INVERT_FACET: `${prefix}_INVERT_FACET`,
    SET_FACETS: `${prefix}_SET_FACETS`,
    ...createFacetValueActionTypes(prefix),
});

export const createActions = actionTypes => ({
    openFacet: createAction(actionTypes.OPEN_FACET),
    toggleFacetValue: createAction(actionTypes.TOGGLE_FACET_VALUE),
    clearFacet: createAction(actionTypes.CLEAR_FACET),
    loadFacetValues: createAction(actionTypes.LOAD_FACET_VALUES),
    loadFacetValuesError: createAction(actionTypes.LOAD_FACET_VALUES_ERROR),
    invertFacet: createAction(actionTypes.INVERT_FACET),
    setFacets: createAction(actionTypes.SET_FACETS),
    ...createFacetValueActions(actionTypes),
});

export const createReducer = prefix => {
    const actionTypes = createActionTypes(prefix);
    const actions = createActions(actionTypes);

    const facetValuesReducer = createFacetValueReducer(actionTypes);

    const reducer = handleActions(
        {
            [actionTypes.OPEN_FACET]: (state, { payload: { name } }) => ({
                ...state,
                openedFacets: {
                    ...state.openedFacets,
                    [name]: !state.openedFacets[name],
                },
            }),
            [actionTypes.LOAD_FACET_VALUES_ERROR]: (
                state,
                { payload: error },
            ) => ({
                ...state,
                error: error.message || error,
            }),
            [actionTypes.TOGGLE_FACET_VALUE]: (
                { appliedFacets, ...state },
                { payload: { name, value } },
            ) => {
                const isChecked = isFacetValuesChecked(
                    { appliedFacets },
                    { name, value },
                );
                const prevValues = appliedFacets[name] || [];
                const newValues = isChecked
                    ? prevValues.filter(v => v !== value)
                    : prevValues.concat(value);

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
                    appliedFacets: omit(appliedFacets, name),
                    invertedFacets: omit(invertedFacets, name),
                };
            },
            [actionTypes.INVERT_FACET]: (
                { invertedFacets, ...state },
                { payload: { name, inverted } },
            ) => ({
                ...state,
                invertedFacets: inverted
                    ? { ...invertedFacets, [name]: true }
                    : omit(invertedFacets, name),
            }),
            [combineActions(
                actionTypes.LOAD_FACET_VALUES_SUCCESS,
                actionTypes.FACET_VALUE_CHANGE,
                actionTypes.FACET_VALUE_SORT,
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
            [SAVE_RESOURCE_SUCCESS]: state => ({
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
