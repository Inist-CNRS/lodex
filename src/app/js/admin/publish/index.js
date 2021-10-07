import { combineActions, createAction, handleActions } from 'redux-actions';

import { SAVE_FIELD_SUCCESS, SAVE_FIELD_ERROR } from '../../fields';

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
        PUBLISH: state => ({
            ...state,
            error: null,
            loading: true,
        }),
        PUBLISH_SUCCESS: state => ({
            ...state,
            error: null,
            loading: false,
        }),
        PUBLISH_ERROR: (state, { payload: error }) => ({
            ...state,
            error: error.message || error,
            loading: false,
        }),
        [combineActions(SAVE_FIELD_ERROR, SAVE_FIELD_SUCCESS)]: state => ({
            ...state,
            loading: false,
        }),
    },
    defaultState,
);

export const getIsPublishing = state => state.loading;
export const getPublishingError = state => state.error;

export const selectors = {
    getIsPublishing,
    getPublishingError,
};
