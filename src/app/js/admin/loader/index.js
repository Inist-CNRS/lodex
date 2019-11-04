import { createAction, handleActions } from 'redux-actions';

export const PRE_LOAD_LOADERS = 'PRE_LOAD_LOADERS';
export const LOAD_LOADERS = 'LOAD_LOADERS';
export const LOAD_LOADERS_ERROR = 'LOAD_LOADERS_ERROR';
export const LOAD_LOADERS_SUCCESS = 'LOAD_LOADERS_SUCCESS';

export const preLoadLoaders = createAction(PRE_LOAD_LOADERS);
export const loadLoaders = createAction(LOAD_LOADERS);
export const loadLoadersError = createAction(LOAD_LOADERS_ERROR);
export const loadLoadersSuccess = createAction(LOAD_LOADERS_SUCCESS);

const initialState = {
    error: false,
    loading: false,
    loaders: [],
};

export default handleActions(
    {
        [LOAD_LOADERS]: state => ({
            ...state,
            error: false,
            loading: true,
        }),
        [LOAD_LOADERS_ERROR]: (state, { payload: error }) => ({
            ...state,
            error,
            loading: false,
        }),
        [LOAD_LOADERS_SUCCESS]: (state, { payload: loaders }) => ({
            ...state,
            error: false,
            loaders,
            loading: false,
        }),
    },
    initialState,
);

export const getLoaders = state => state.loaders;
export const areLoadersLoaded = state => getLoaders(state).length > 0;

export const selectors = {
    preLoadLoaders,
    areLoadersLoaded,
    getLoaders,
};
