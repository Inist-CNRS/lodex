// @ts-expect-error TS7016
import { createAction, handleActions } from 'redux-actions';
import { PENDING, STARTING, ERROR } from '../../../../common/progressStatus';
import {
    CLEAR_DATASET,
    CLEAR_DATASET_ERROR,
    CLEAR_PUBLISHED_ERROR,
} from '../clear';
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
    isBackground: false,
    label: undefined,
};

export default handleActions(
    {
        [UPDATE_PROGRESS]: (
            // @ts-expect-error TS7006
            state,
            {
                payload: {
                    // @ts-expect-error TS7031
                    status,
                    // @ts-expect-error TS7031
                    progress,
                    // @ts-expect-error TS7031
                    target,
                    // @ts-expect-error TS7031
                    symbol,
                    // @ts-expect-error TS7031
                    label,
                    // @ts-expect-error TS7031
                    isBackground,
                },
            },
        ) => ({
            ...state,
            status,
            progress,
            target,
            symbol,
            error: undefined,
            label,
            isBackground,
        }),
        // @ts-expect-error TS7006
        [UPLOAD_FILE]: (state) => ({
            ...state,
            status: STARTING,
            progress: undefined,
            target: undefined,
            error: undefined,
        }),
        // @ts-expect-error TS7006
        [PUBLISH]: (state) => ({
            ...state,
            status: STARTING,
            progress: undefined,
            target: undefined,
            error: undefined,
            isBackground: true,
        }),
        // @ts-expect-error TS7006
        [CLEAR_DATASET]: (state) => ({
            ...state,
            status: STARTING,
            progress: undefined,
            target: undefined,
            error: undefined,
        }),
        // @ts-expect-error TS7006
        [CLEAR_DATASET_ERROR]: (state) => ({
            ...state,
            status: PENDING,
            progress: undefined,
            target: undefined,
            error: undefined,
        }),
        // @ts-expect-error TS7006
        [CLEAR_PUBLISHED_ERROR]: (state) => ({
            ...state,
            status: PENDING,
            progress: undefined,
            target: undefined,
            error: undefined,
        }),
        // @ts-expect-error TS7006
        [ERROR_PROGRESS]: (state) => ({
            ...state,
            status: ERROR,
            progress: undefined,
            target: undefined,
            error: true,
        }),
        // @ts-expect-error TS7006
        [CLEAR_PROGRESS]: (state) => ({
            ...state,
            status: PENDING,
            progress: undefined,
            target: undefined,
            error: false,
        }),
    },
    defaultState,
);

// @ts-expect-error TS7006
const getProgress = (state) => state;
// @ts-expect-error TS7031
const getProgressAndTarget = ({ progress, target }) => ({ progress, target });

export const selectors = {
    getProgress,
    getProgressAndTarget,
};
