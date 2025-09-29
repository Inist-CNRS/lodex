import { createAction, handleActions } from 'redux-actions';

export const FETCH = 'FETCH';
export const FETCH_ERROR = 'FETCH_ERROR';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';

export const fetch = createAction(
    FETCH,
    ({ config }) => config,
    ({ name }) => ({ name }),
);
export const fetchError = createAction(
    FETCH_ERROR,
    ({ error }) => error,
    ({ name }) => ({ name }),
);
export const fetchSuccess = createAction(
    FETCH_SUCCESS,
    ({ response }) => response,
    ({ name }) => ({ name }),
);

export const defaultState = {};

export default handleActions(
    {
        // @ts-expect-error TS7006
        FETCH: (state, { payload: config, meta: { name } }) => ({
            ...state,
            [name]: {
                ...config,
                error: null,
                loading: true,
                response: null,
            },
        }),
        // @ts-expect-error TS7006
        FETCH_ERROR: (state, { payload: error, meta: { name } }) => ({
            ...state,
            [name]: {
                // @ts-expect-error TS2339
                ...state[name],
                error,
                loading: false,
                response: null,
            },
        }),
        // @ts-expect-error TS7006
        FETCH_SUCCESS: (state, { payload: response, meta: { name } }) => ({
            ...state,
            [name]: {
                // @ts-expect-error TS2339
                ...state[name],
                error: null,
                loading: false,
                response,
            },
        }),
    },
    defaultState,
);
