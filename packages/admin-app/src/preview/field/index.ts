import { createAction, combineActions, handleActions } from 'redux-actions';
import { LODEX_FIELD_FORM_CHANGE } from '@lodex/frontend-common/fields/reducer';

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
        // @ts-expect-error TS2464
        [combineActions(
            LODEX_FIELD_FORM_CHANGE,
            // @ts-expect-error TS7006
        )]: (state) => ({ ...state, isComputing: true }),
        // @ts-expect-error TS7006
        COMPUTE_FIELD_PREVIEW_SUCCESS: (state, { payload: resources }) => ({
            isComputing: false,
            resources,
        }),
        COMPUTE_FIELD_PREVIEW_ERROR: () => defaultState,
    },
    defaultState,
);

// @ts-expect-error TS7006
export const isComputing = (state) => state.isComputing;
// @ts-expect-error TS7006
export const getFieldPreview = (state) => state.resources;
// @ts-expect-error TS7006
export const hasFieldPreview = (state) => !!state.resources.length;

export const selectors = {
    isComputing,
    getFieldPreview,
    hasFieldPreview,
};
