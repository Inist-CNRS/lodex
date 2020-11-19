import { createAction, handleActions } from 'redux-actions';

export const LOAD_SUBRESOURCES = 'LOAD_SUBRESOURCES';
export const LOAD_SUBRESOURCES_ERROR = 'LOAD_SUBRESOURCES_ERROR';
export const LOAD_SUBRESOURCES_SUCCESS = 'LOAD_SUBRESOURCES_SUCCESS';
export const CREATE_SUBRESOURCE = 'CREATE_SUBRESOURCE';
export const UPDATE_SUBRESOURCE = 'UPDATE_SUBRESOURCE';
export const CREATE_SUBRESOURCE_OPTIMISTIC = 'CREATE_SUBRESOURCE_OPTIMISTIC';
export const UPDATE_SUBRESOURCE_OPTIMISTIC = 'UPDATE_SUBRESOURCE_OPTIMISTIC';

export const loadSubresources = createAction(LOAD_SUBRESOURCES);
export const loadSubresourcesError = createAction(LOAD_SUBRESOURCES_ERROR);
export const loadSubresourcesSuccess = createAction(LOAD_SUBRESOURCES_SUCCESS);
export const createSubresource = createAction(CREATE_SUBRESOURCE);
export const updateSubresource = createAction(UPDATE_SUBRESOURCE);
export const createSubresourceOptimistic = createAction(
    CREATE_SUBRESOURCE_OPTIMISTIC,
);
export const updateSubresourceOptimistic = createAction(
    UPDATE_SUBRESOURCE_OPTIMISTIC,
);

export const initialState = {
    error: null,
    loading: false,
    subresources: [],
};

export default handleActions(
    {
        LOAD_SUBRESOURCES: state => ({ ...state, loading: true }),
        LOAD_SUBRESOURCES_ERROR: (state, { payload: error }) => ({
            ...state,
            error,
            loading: false,
        }),
        LOAD_SUBRESOURCES_SUCCESS: (state, { payload: subresources }) => ({
            ...state,
            subresources,
            loading: false,
        }),
        CREATE_SUBRESOURCE_OPTIMISTIC: (state, { payload: subresource }) => ({
            ...state,
            subresources: [...state.subresources, subresource],
        }),
        UPDATE_SUBRESOURCE_OPTIMISTIC: (state, { payload: subresource }) => ({
            ...state,
            subresources: state.subresources.map(sr => {
                if (sr._id === subresource._id) {
                    return subresource;
                }

                return sr;
            }),
        }),
    },
    initialState,
);

export const isLoading = state => state.loading;

export const selectors = {
    isLoading,
};
