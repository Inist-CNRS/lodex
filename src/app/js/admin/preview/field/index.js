import { createAction, combineActions, handleActions } from 'redux-actions';

import {
    CHANGE as REDUX_FORM_CHANGE,
    ARRAY_INSERT as REDUX_FORM_ARRAY_INSERT,
    ARRAY_REMOVE as REDUX_FORM_ARRAY_REMOVE,
    ARRAY_MOVE as REDUX_FORM_ARRAY_MOVE,
    ARRAY_PUSH as REDUX_FORM_ARRAY_PUSH,
    ARRAY_SPLICE as REDUX_FORM_ARRAY_SPLICE,
    REGISTER_FIELD as REDUX_FORM_REGISTER_FIELD,
    UNREGISTER_FIELD as REDUX_FORM_UNREGISTER_FIELD,
} from 'redux-form/lib/actionTypes';

export const COMPUTE_FIELD_PREVIEW_SUCCESS = 'COMPUTE_FIELD_PREVIEW_SUCCESS';
export const COMPUTE_FIELD_PREVIEW_ERROR = 'COMPUTE_FIELD_PREVIEW_ERROR';

export const computeFieldPreviewSuccess = createAction(
    COMPUTE_FIELD_PREVIEW_SUCCESS,
);
export const computeFieldPreviewError = createAction(
    COMPUTE_FIELD_PREVIEW_ERROR,
);

export const defaultState = {
    isComputing: false,
    resources: [],
};

export default handleActions(
    {
        [combineActions(
            REDUX_FORM_CHANGE,
            REDUX_FORM_ARRAY_INSERT,
            REDUX_FORM_ARRAY_REMOVE,
            REDUX_FORM_ARRAY_MOVE,
            REDUX_FORM_ARRAY_PUSH,
            REDUX_FORM_ARRAY_SPLICE,
            REDUX_FORM_REGISTER_FIELD,
            REDUX_FORM_UNREGISTER_FIELD,
        )]: state => ({ ...state, isComputing: true }),
        COMPUTE_FIELD_PREVIEW_SUCCESS: (state, { payload: resources }) => ({
            isComputing: false,
            resources,
        }),
        COMPUTE_FIELD_PREVIEW_ERROR: () => defaultState,
    },
    defaultState,
);

export const isComputing = state => state.isComputing;
export const getFieldPreview = state => state.resources;
export const hasFieldPreview = state => !!state.resources.length;

export const selectors = {
    isComputing,
    getFieldPreview,
    hasFieldPreview,
};
