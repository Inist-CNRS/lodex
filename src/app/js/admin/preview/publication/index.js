import { createAction, combineActions, handleActions } from 'redux-actions';

import {
    CHANGE as REDUX_FORM_CHANGE,
    ARRAY_INSERT as REDUX_FORM_ARRAY_INSERT,
    ARRAY_REMOVE as REDUX_FORM_ARRAY_REMOVE,
    REGISTER_FIELD as REDUX_FORM_REGISTER_FIELD,
    UNREGISTER_FIELD as REDUX_FORM_UNREGISTER_FIELD,
    DESTROY as REDUX_FORM_DESTROY,
} from 'redux-form/lib/actionTypes';

import {
    LOAD_FIELD_SUCCESS,
    ADD_FIELD,
    REMOVE_FIELD_SUCCESS,
    SAVE_FIELD_SUCCESS,
} from '../../fields';

import {
    LOAD_PARSING_RESULT_SUCCESS,
} from '../../parsing';

export const COMPUTE_PREVIEW = 'COMPUTE_PREVIEW';
export const COMPUTE_PREVIEW_SUCCESS = 'COMPUTE_PREVIEW_SUCCESS';
export const COMPUTE_PREVIEW_ERROR = 'COMPUTE_PREVIEW_ERROR';

export const computePreview = createAction(COMPUTE_PREVIEW);
export const computePreviewSuccess = createAction(COMPUTE_PREVIEW_SUCCESS);
export const computePreviewError = createAction(COMPUTE_PREVIEW_ERROR);

export const defaultState = {
    isComputing: false,
    resources: [],
};

export default handleActions({
    [combineActions(
        COMPUTE_PREVIEW,
        REDUX_FORM_CHANGE,
        REDUX_FORM_ARRAY_INSERT,
        REDUX_FORM_ARRAY_REMOVE,
        REDUX_FORM_REGISTER_FIELD,
        REDUX_FORM_UNREGISTER_FIELD,
        REDUX_FORM_DESTROY,
        LOAD_FIELD_SUCCESS,
        ADD_FIELD,
        REMOVE_FIELD_SUCCESS,
        SAVE_FIELD_SUCCESS,
        LOAD_PARSING_RESULT_SUCCESS,
    )]: state => ({ ...state, isComputing: true }),
    COMPUTE_PREVIEW_SUCCESS: (state, { payload: resources }) => ({ isComputing: false, resources }),
    COMPUTE_PREVIEW_ERROR: () => defaultState,
}, defaultState);

export const isComputing = state => state.isComputing;
export const getPublicationPreview = state => state.resources;
export const hasPublicationPreview = state => !!state.resources.length;

export const selectors = {
    isComputing,
    getPublicationPreview,
    hasPublicationPreview,
};
