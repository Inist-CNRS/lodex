import { createAction, handleActions } from 'redux-actions';

export const CLEAR_DATASET = 'CLEAR_DATASET';
export const CLEAR_DATASET_ERROR = 'CLEAR_DATASET_ERROR';
export const CLEAR_DATASET_SUCCESS = 'CLEAR_DATASET_SUCCESS';

export const clear_dataset = createAction(CLEAR_DATASET);
export const clear_dataset_error = createAction(CLEAR_DATASET_ERROR);
export const clear_dataset_success = createAction(CLEAR_DATASET_SUCCESS);

export const initialState = {
    status: null,
    loading: false,
};

export default handleActions({
    CLEAR_DATASET: state => ({ ...state, loading: true }),
    CLEAR_DATASET_ERROR: state => ({ ...state, status: 'error', loading: false }),
    CLEAR_DATASET_SUCCESS: state => ({ ...state, status: 'success', loading: false }),
}, initialState);
