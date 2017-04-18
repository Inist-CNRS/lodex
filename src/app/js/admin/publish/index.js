import { combineActions, createAction, handleActions } from 'redux-actions';

import { SAVE_FIELD_SUCCESS, SAVE_FIELD_ERROR } from '../fields';

export const PUBLISH = 'PUBLISH';
export const PUBLISH_WARN = 'PUBLISH_WARN';
export const PUBLISH_CONFIRM = 'PUBLISH_CONFIRM';
export const PUBLISH_CANCEL = 'PUBLISH_CANCEL';
export const PUBLISH_SUCCESS = 'PUBLISH_SUCCESS';
export const PUBLISH_ERROR = 'PUBLISH_ERROR';

export const publish = createAction(PUBLISH);
export const publishSuccess = createAction(PUBLISH_SUCCESS);
export const publishError = createAction(PUBLISH_ERROR);
export const publishWarn = createAction(PUBLISH_WARN);
export const publishConfirm = createAction(PUBLISH_CONFIRM);
export const publishCancel = createAction(PUBLISH_CANCEL);

export const defaultState = {
    error: null,
    loading: false,
    nbInvalidUri: 0,
};

export default handleActions({
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
    PUBLISH_WARN: (state, { payload: nbInvalidUri }) => ({
        ...state,
        nbInvalidUri,
    }),
    PUBLISH_CONFIRM: state => ({
        ...state,
        nbInvalidUri: 0,
    }),
    PUBLISH_CANCEL: state => ({
        ...state,
        loading: false,
        nbInvalidUri: 0,
    }),
    [combineActions(SAVE_FIELD_ERROR, SAVE_FIELD_SUCCESS)]: state => ({
        ...state,
        loading: false,
    }),
}, defaultState);

export const getIsPublishing = state => state.loading;
export const getPublishingError = state => state.error;
export const getNbInvalidUri = state => state.nbInvalidUri;

export const selectors = {
    getIsPublishing,
    getPublishingError,
    getNbInvalidUri,
};
