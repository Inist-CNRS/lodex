import { createAction, combineActions, handleActions } from 'redux-actions';

import {
    LOAD_FIELD_SUCCESS,
    REMOVE_FIELD_SUCCESS,
    SAVE_FIELD_SUCCESS,
} from '../../../fields';

import {
    LOAD_PARSING_RESULT_SUCCESS,
} from '../../parsing';

export const COMPUTE_PUBLICATION_PREVIEW_SUCCESS = 'COMPUTE_PUBLICATION_PREVIEW_SUCCESS';
export const COMPUTE_PUBLICATION_PREVIEW_ERROR = 'COMPUTE_PUBLICATION_PREVIEW_ERROR';

export const computePublicationPreviewSuccess = createAction(COMPUTE_PUBLICATION_PREVIEW_SUCCESS);
export const computePublicationPreviewError = createAction(COMPUTE_PUBLICATION_PREVIEW_ERROR);

export const defaultState = {
    isComputing: false,
    resources: [],
};

export default handleActions({
    [combineActions(
        LOAD_FIELD_SUCCESS,
        REMOVE_FIELD_SUCCESS,
        SAVE_FIELD_SUCCESS,
        LOAD_PARSING_RESULT_SUCCESS,
    )]: state => ({ ...state, isComputing: true }),
    COMPUTE_PUBLICATION_PREVIEW_SUCCESS: (state, { payload: resources }) => ({ isComputing: false, resources }),
    COMPUTE_PUBLICATION_PREVIEW_ERROR: () => defaultState,
}, defaultState);

export const isComputing = state => state.isComputing;
export const getPublicationPreview = state => state.resources;
export const hasPublicationPreview = state => !!state.resources.length;

export const selectors = {
    isComputing,
    getPublicationPreview,
    hasPublicationPreview,
};
