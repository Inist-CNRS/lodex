import { createAction, handleActions } from 'redux-actions';

import { LOGOUT, SIGNOUT } from '@lodex/frontend-common/user/reducer';

export const IMPORT_FIELDS = 'IMPORT_FIELDS';
export const IMPORT_FIELDS_ERROR = 'IMPORT_FIELDS_ERROR';
export const IMPORT_FIELDS_SUCCESS = 'IMPORT_FIELDS_SUCCESS';

export const importFields = createAction(IMPORT_FIELDS);
export const importFieldsError = createAction(IMPORT_FIELDS_ERROR);
export const importFieldsSuccess = createAction(IMPORT_FIELDS_SUCCESS);

export const initialState = {
    status: null,
    loading: false,
    hasEnrichments: false,
    hasPrecomputed: false,
    themeNotFound: null,
};

// @ts-expect-error TS7006
export default handleActions(
    {
        // Reset on start, not right after the result: React 18 would batch
        // both updates and Menu would never see the result to toast it
        IMPORT_FIELDS: () => ({ ...initialState, loading: true }),
        IMPORT_FIELDS_ERROR: (state) => ({
            ...state,
            status: 'error',
            loading: false,
        }),
        IMPORT_FIELDS_SUCCESS: (state, { payload }) => ({
            ...state,
            status: 'success',
            loading: false,
            hasEnrichments: payload.hasEnrichments,
            hasPrecomputed: payload.hasPrecomputed,
            themeNotFound: payload.themeNotFound ?? null,
        }),
        // Menu remounts on the next login and would replay the last result
        [LOGOUT]: () => initialState,
        [SIGNOUT]: () => initialState,
    },
    initialState,
);

// @ts-expect-error TS7006
export const hasImportFailed = (state) => state.status === 'error';
// @ts-expect-error TS7006
export const hasImportSucceeded = (state) => state.status === 'success';
// @ts-expect-error TS7006
export const hasEnrichments = (state) => state.hasEnrichments;
// @ts-expect-error TS7006
export const hasPrecomputed = (state) => state.hasPrecomputed;
// @ts-expect-error TS7006
export const getThemeNotFound = (state) => state.themeNotFound;

export const selectors = {
    hasImportFailed,
    hasImportSucceeded,
    hasEnrichments,
    hasPrecomputed,
    getThemeNotFound,
};
