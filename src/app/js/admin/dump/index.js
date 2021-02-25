import { createAction, handleActions } from 'redux-actions';

export const DUMP_DATASET = 'DUMP_DATASET';
export const DUMP_DATASET_SUCCESS = 'DUMP_DATASET_SUCCESS';
export const DUMP_DATASET_ERROR = 'DUMP_DATASET_ERROR';

export const dumpDataset = createAction(DUMP_DATASET);
export const dumpDatasetSuccess = createAction(DUMP_DATASET_SUCCESS);
export const dumpDatasetError = createAction(DUMP_DATASET_ERROR);

export const initialState = {
    status: null,
    loading: false,
};

export default handleActions(
    {
        DUMP_DATASET: state => ({ ...state, loading: true }),
        DUMP_DATASET_ERROR: state => ({
            ...state,
            status: 'error',
            loading: false,
        }),
        DUMP_DATASET_SUCCESS: state => ({
            ...state,
            status: 'success',
            loading: false,
        }),
    },
    initialState,
);

export const isDumpLoading = state => state.loading;

export const selectors = {
    isDumpLoading,
};
