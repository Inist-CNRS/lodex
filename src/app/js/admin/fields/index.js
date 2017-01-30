import { createAction, handleActions } from 'redux-actions';

export const LOAD_FIELD = 'LOAD_FIELD';
export const LOAD_FIELD_SUCCESS = 'LOAD_FIELD_SUCCESS';
export const LOAD_FIELD_ERROR = 'LOAD_FIELD_ERROR';

export const loadField = createAction(LOAD_FIELD);
export const loadFieldSuccess = createAction(LOAD_FIELD_SUCCESS);
export const loadFieldError = createAction(LOAD_FIELD_ERROR);

export const defaultState = [];

export default handleActions({
    LOAD_FIELD_SUCCESS: (state, { payload }) => (payload),
    LOAD_FIELD_ERROR: () => defaultState,
}, defaultState);

export const getLoadFieldRequest = state => ({
    url: '/api/field',
    credentials: 'include',
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${state.user.token}`,
        'Content-Type': 'application/json',
    },
});

export const getFields = state => state.fields;

export const getPublicationColumns = state => state.fields.map(({ label }) => label);
