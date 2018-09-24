import { createAction, handleActions } from 'redux-actions';

export const UPDATE_PROGRESS = 'UPDATE_PROGRESS';
export const START_PROGRESS = 'START_PROGRESS';
export const ERROR_PROGRESS = 'ERROR_PROGRESS';

export const updateProgress = createAction(UPDATE_PROGRESS);
export const errorProgress = createAction(ERROR_PROGRESS);

export const defaultState = {
    status: 'pending',
    progress: undefined,
    target: undefined,
    error: undefined,
};

export default handleActions(
    {
        [UPDATE_PROGRESS]: (state, { status, progress, target }) => ({
            ...state,
            status,
            progress,
            target,
        }),
        [START_PROGRESS]: state => ({
            ...state,
            status: 'publishing',
        }),
        [ERROR_PROGRESS]: (state, { payload: { error } }) => ({
            ...state,
            error,
        }),
    },
    defaultState,
);

const getProgress = state => state;

export const selectors = {
    getProgress,
};
