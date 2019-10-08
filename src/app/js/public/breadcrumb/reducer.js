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
        [LOAD_BREADCRUMB_SUCCESS]: (state, { payload: { breadcrumb } }) => ({
            ...state,
            breadcrumb,
            error: null,
        }),
        [LOAD_BREADCRUMB_ERROR]: (state, { payload: { error } }) => ({
            ...state,
            error,
        }),
    },
    initialState,
);

export const hasBreadcrumb = state => state;

const getBreadcrumb = state => state;

export const fromBreadcrumb = {
    hasBreadcrumb,
    getBreadcrumb,
};
