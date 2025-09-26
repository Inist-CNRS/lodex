// @ts-expect-error TS7016
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
        // @ts-expect-error TS7006
        [LOAD_LOADERS]: (state) => ({
            ...state,
            error: false,
            loading: true,
        }),
        // @ts-expect-error TS7006
        [LOAD_LOADERS_ERROR]: (state, { payload: error }) => ({
            ...state,
            error,
            loading: false,
        }),
        // @ts-expect-error TS7006
        [LOAD_LOADERS_SUCCESS]: (state, { payload: loaders }) => ({
            ...state,
            error: false,
            loaders,
            loading: false,
        }),
    },
    initialState,
);

// @ts-expect-error TS7006
export const getLoaders = (state) => state.loaders;
// @ts-expect-error TS7006
export const areLoadersLoaded = (state) => getLoaders(state).length > 0;

export const selectors = {
    preLoadLoaders,
    areLoadersLoaded,
    getLoaders,
};
