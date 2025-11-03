import { createAction, handleActions } from 'redux-actions';
import get from 'lodash/get';
import { LOAD_RESOURCE_SUCCESS } from '../../public-app/src/resource';

export const PRE_LOAD_FORMAT_DATA = 'PRE_LOAD_FORMAT_DATA';
export const UN_LOAD_FORMAT_DATA = 'UN_LOAD_FORMAT_DATA';
export const LOAD_FORMAT_DATA = 'LOAD_FORMAT_DATA';
export const LOAD_FORMAT_DATA_SUCCESS = 'LOAD_FORMAT_DATA_SUCCESS';
export const LOAD_FORMAT_DATA_ERROR = 'LOAD_FORMAT_DATA_ERROR';

export const preLoadFormatData = createAction(PRE_LOAD_FORMAT_DATA);
export const unLoadFormatData = createAction(UN_LOAD_FORMAT_DATA);
export const loadFormatData = createAction(LOAD_FORMAT_DATA);
export const loadFormatDataSuccess = createAction(LOAD_FORMAT_DATA_SUCCESS);
export const loadFormatDataError = createAction(LOAD_FORMAT_DATA_ERROR);

export const defaultState = {};

export default handleActions(
    {
        // @ts-expect-error TS7006
        [LOAD_FORMAT_DATA]: (state, { payload: { field } }) => ({
            ...state,
            [field.name]: 'loading',
        }),
        [LOAD_FORMAT_DATA_SUCCESS]: (
            state,
            // @ts-expect-error TS7031
            { payload: { name, data, total } },
        ) => ({
            ...state,
            [name]: { data, total },
        }),
        [LOAD_RESOURCE_SUCCESS]: (state, { payload }) => ({
            ...state,
            // @ts-expect-error TS7006
            ...(payload && payload.prefetchedData),
        }),
        // @ts-expect-error TS7006
        [LOAD_FORMAT_DATA_ERROR]: (state, { payload: { name, error } }) => ({
            ...state,
            [name]: { error },
        }),
        // @ts-expect-error TS7006
        [UN_LOAD_FORMAT_DATA]: (state, { payload: { name } }) => ({
            ...state,
            [name]: null,
        }),
    },
    defaultState,
);

// @ts-expect-error TS7006
const isFormatDataLoaded = (state, name) => state[name] !== 'loading';

// @ts-expect-error TS7006
const getFormatData = (state, name) => get(state, [name, 'data']);
// @ts-expect-error TS7006
const getFormatTotal = (state, name) => get(state, [name, 'total']);
// @ts-expect-error TS7006
const getFormatError = (state, name) => get(state, [name, 'error']);

// @ts-expect-error TS7006
export const getCurrentFieldNames = (state) =>
    Object.keys(state).filter((key) => !!state[key]);

export const fromFormat = {
    isFormatDataLoaded,
    getFormatData,
    getFormatTotal,
    getFormatError,
    getCurrentFieldNames,
};
