// @ts-expect-error TS7016
import { createAction, handleActions } from 'redux-actions';

export const LOAD_BREADCRUMB = 'LOAD_BREADCRUMB';
export const LOAD_BREADCRUMB_SUCCESS = 'LOAD_BREADCRUMB_SUCCESS';
export const LOAD_BREADCRUMB_ERROR = 'LOAD_BREADCRUMB_ERROR';

export const loadBreadcrumb = createAction(LOAD_BREADCRUMB);
export const loadBreadcrumbSuccess = createAction(LOAD_BREADCRUMB_SUCCESS);
export const loadBreadcrumbError = createAction(LOAD_BREADCRUMB_ERROR);

export const initialState = {
    error: null,
    breadcrumb: null,
};

export default handleActions(
    {
        // @ts-expect-error TS7006
        [LOAD_BREADCRUMB_SUCCESS]: (state, { payload: { breadcrumb } }) => ({
            ...state,
            breadcrumb,
            error: null,
        }),
        // @ts-expect-error TS7006
        [LOAD_BREADCRUMB_ERROR]: (state, { payload: { error } }) => ({
            ...state,
            error,
        }),
    },
    initialState,
);

// @ts-expect-error TS7006
export const hasBreadcrumb = (state) => state;

// @ts-expect-error TS7006
const getBreadcrumb = (state) => state;

export const fromBreadcrumb = {
    hasBreadcrumb,
    getBreadcrumb,
};
