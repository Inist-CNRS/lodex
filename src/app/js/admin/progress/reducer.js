import { createAction, handleActions, combineActions } from 'redux-actions';
import { PENDING, STARTING, ERROR } from '../../../../common/progressStatus';
import { PUBLISH } from '../publish';
import { UPLOAD_FILE } from '../upload';

export const UPDATE_PROGRESS = 'UPDATE_PROGRESS';
export const ERROR_PROGRESS = 'ERROR_PROGRESS';
export const LOAD_PROGRESS = 'LOAD_PROGRESS';
export const FINISH_PROGRESS = 'FINISH_PROGRESS';
export const CLEAR_PROGRESS = 'CLEAR_PROGRESS';

export const updateProgress = createAction(UPDATE_PROGRESS);
export const errorProgress = createAction(ERROR_PROGRESS);
export const loadProgress = createAction(LOAD_PROGRESS);
export const finishProgress = createAction(FINISH_PROGRESS);
export const clearProgress = createAction(CLEAR_PROGRESS);

export const defaultState = {
    status: PENDING,
    progress: undefined,
    target: undefined,
    error: false,
    symbol: undefined,
};

export default handleActions(
    {
        [UPDATE_PROGRESS]: (
            state,
            { payload: { status, progress, target, symbol } },
        ) => ({
            ...state,
            status,
            progress,
            target,
            symbol,
            error: undefined,
        }),
        [combineActions(PUBLISH, UPLOAD_FILE)]: state => ({
            ...state,
            status: STARTING,
            progress: undefined,
            target: undefined,
            error: undefined,
        }),
        [ERROR_PROGRESS]: state => ({
            ...state,
            status: ERROR,
            progress: undefined,
            target: undefined,
            error: true,
        }),
        [CLEAR_PROGRESS]: state => ({
            ...state,
            status: PENDING,
            progress: undefined,
            target: undefined,
            error: false,
        }),
    },
    defaultState,
);

const getProgress = state => state;

export const selectors = {
    getProgress,
};
