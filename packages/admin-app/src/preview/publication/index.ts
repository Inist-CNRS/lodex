import { createAction, combineActions, handleActions } from 'redux-actions';

import {
    LOAD_FIELD_SUCCESS,
    REMOVE_FIELD_SUCCESS,
    SAVE_FIELD_SUCCESS,
} from '../../../../../src/app/js/fields';

import { LOAD_PARSING_RESULT_SUCCESS } from '../../parsing';

export const COMPUTE_PUBLICATION_PREVIEW_SUCCESS =
    'COMPUTE_PUBLICATION_PREVIEW_SUCCESS';
export const COMPUTE_PUBLICATION_PREVIEW_ERROR =
    'COMPUTE_PUBLICATION_PREVIEW_ERROR';

export const computePublicationPreviewSuccess = createAction(
    COMPUTE_PUBLICATION_PREVIEW_SUCCESS,
);
export const computePublicationPreviewError = createAction(
    COMPUTE_PUBLICATION_PREVIEW_ERROR,
);

export const defaultState = {
    isComputing: false,
    resources: [],
};

export default handleActions(
    {
        // @ts-expect-error TS7006
        [combineActions(
            LOAD_FIELD_SUCCESS,
            REMOVE_FIELD_SUCCESS,
            SAVE_FIELD_SUCCESS,
            LOAD_PARSING_RESULT_SUCCESS,
            // @ts-expect-error TS7006
        )]: (state) => ({ ...state, isComputing: true }),
        // @ts-expect-error TS7006
        COMPUTE_PUBLICATION_PREVIEW_SUCCESS: (
            // @ts-expect-error TS7006
            state,
            { payload: resources },
        ) => ({ isComputing: false, resources }),
        COMPUTE_PUBLICATION_PREVIEW_ERROR: () => defaultState,
    },
    defaultState,
);

// @ts-expect-error TS7006
export const isComputing = (state) => state.isComputing;
// @ts-expect-error TS7006
export const getPublicationPreview = (state) => state.resources;
// @ts-expect-error TS7006
export const hasPublicationPreview = (state) => !!state.resources.length;

export const selectors = {
    isComputing,
    getPublicationPreview,
    hasPublicationPreview,
};
