import { combineActions, createAction, handleActions } from 'redux-actions';

import {
    SAVE_FIELD_SUCCESS,
    SAVE_FIELD_ERROR,
} from '../../../../src/app/js/fields/reducer';

export const PUBLISH = 'PUBLISH';
export const PUBLISH_SUCCESS = 'PUBLISH_SUCCESS';
export const PUBLISH_ERROR = 'PUBLISH_ERROR';

export const publish = createAction(PUBLISH);
export const publishSuccess = createAction(PUBLISH_SUCCESS);
export const publishError = createAction(PUBLISH_ERROR);

export const defaultState = {
    error: null,
    loading: false,
};

export default handleActions(
    {
        PUBLISH: (state) => ({
            ...state,
            error: null,
            loading: true,
        }),
        PUBLISH_SUCCESS: (state) => ({
            ...state,
            error: null,
            loading: false,
        }),
        PUBLISH_ERROR: (state, { payload: error }) => ({
            ...state,
            // @ts-expect-error TS2339
            error: error.message || error,
            loading: false,
        }),
        // @ts-expect-error TS7006
        [combineActions(SAVE_FIELD_ERROR, SAVE_FIELD_SUCCESS)]: (state) => ({
            ...state,
            loading: false,
        }),
    },
    defaultState,
);

// @ts-expect-error TS7006
export const getIsPublishing = (state) => state.loading;
// @ts-expect-error TS7006
export const getPublishingError = (state) => state.error;

export const selectors = {
    getIsPublishing,
    getPublishingError,
};
