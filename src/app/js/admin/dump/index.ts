// @ts-expect-error TS7016
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
        // @ts-expect-error TS7006
        DUMP_DATASET: (state) => ({ ...state, loading: true }),
        // @ts-expect-error TS7006
        DUMP_DATASET_ERROR: (state) => ({
            ...state,
            status: 'error',
            loading: false,
        }),
        // @ts-expect-error TS7006
        DUMP_DATASET_SUCCESS: (state) => ({
            ...state,
            status: 'success',
            loading: false,
        }),
    },
    initialState,
);

// @ts-expect-error TS7006
export const isDumpLoading = (state) => state.loading;

export const selectors = {
    isDumpLoading,
};
