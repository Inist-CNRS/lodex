import { createAction, handleActions } from 'redux-actions';

export const PUBLISH = 'PUBLISH';
export const PUBLISH_SUCCESS = 'PUBLISH_SUCCESS';
export const PUBLISH_ERROR = 'PUBLISH_ERROR';

export const publish = createAction(PUBLISH);
export const publishSuccess = createAction(PUBLISH_SUCCESS);
export const publishError = createAction(PUBLISH_ERROR);

export const defaultState = {
    loading: false,
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
        error,
        loading: false,
    }),
}, defaultState);
