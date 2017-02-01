import { createAction, handleActions } from 'redux-actions';

export const COMPUTE_PREVIEW = 'COMPUTE_PREVIEW';
export const COMPUTE_PREVIEW_SUCCESS = 'COMPUTE_PREVIEW_SUCCESS';
export const COMPUTE_PREVIEW_ERROR = 'COMPUTE_PREVIEW_ERROR';

export const computePreview = createAction(COMPUTE_PREVIEW);
export const computePreviewSuccess = createAction(COMPUTE_PREVIEW_SUCCESS);
export const computePreviewError = createAction(COMPUTE_PREVIEW_ERROR);

export const defaultState = [];

export default handleActions({
    COMPUTE_PREVIEW_SUCCESS: (state, { payload }) => (payload),
    COMPUTE_PREVIEW_ERROR: () => defaultState,
}, defaultState);
