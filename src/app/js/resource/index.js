import { createAction, handleActions } from 'redux-actions';

export const LOAD_RESOURCES = 'LOAD_RESOURCES';
export const LOAD_RESOURCES_ERROR = 'LOAD_RESOURCES_ERROR';
export const LOAD_RESOURCES_SUCCESS = 'LOAD_RESOURCES_SUCCESS';

export const loadResources = createAction(LOAD_RESOURCES);
export const loadResourcesError = createAction(LOAD_RESOURCES_ERROR);
export const loadResourcesSuccess = createAction(LOAD_RESOURCES_SUCCESS);

export const initialState = {
    error: null,
    loading: false,
    resources: [],
};

export default handleActions(
    {
        LOAD_RESOURCES: state => ({ ...state, loading: true }),
        LOAD_RESOURCES_ERROR: (state, { payload: error }) => ({
            ...state,
            error,
            loading: false,
        }),
        LOAD_RESOURCES_SUCCESS: (state, { payload: resources }) => ({
            ...state,
            resources,
            loading: false,
        }),
    },
    initialState,
);
