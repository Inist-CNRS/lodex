import { createAction, handleActions } from 'redux-actions';
import { PENDING, STARTING } from '../../../../common/progressStatus';
import { PUBLISH } from '../publish';

export const UPDATE_PROGRESS = 'UPDATE_PROGRESS';
export const ERROR_PROGRESS = 'ERROR_PROGRESS';
export const LOAD_PROGRESS = 'LOAD_PROGRESS';

export const updateProgress = createAction(UPDATE_PROGRESS);
export const errorProgress = createAction(ERROR_PROGRESS);
export const loadProgress = createAction(LOAD_PROGRESS);

export const defaultState = {
    status: PENDING,
    progress: undefined,
    target: undefined,
    error: undefined,
};

export default handleActions(
    {
        [UPDATE_PROGRESS]: (
            state,
            { payload: { status, progress, target } },
        ) => ({
            ...state,
            status,
            progress,
            target,
            error: undefined,
        }),
        [PUBLISH]: state => ({
            ...state,
            status: STARTING,
            error: undefined,
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
