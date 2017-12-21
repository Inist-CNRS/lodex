import { createAction, handleActions } from 'redux-actions';
import get from 'lodash.get';

export const PRE_LOAD_CHART_DATA = 'PRE_LOAD_CHART_DATA';
export const LOAD_CHART_DATA = 'LOAD_CHART_DATA';
export const LOAD_CHART_DATA_SUCCESS = 'LOAD_CHART_DATA_SUCCESS';
export const LOAD_CHART_DATA_ERROR = 'LOAD_CHART_DATA_ERROR';

export const preLoadChartData = createAction(PRE_LOAD_CHART_DATA);
export const loadChartData = createAction(LOAD_CHART_DATA);
export const loadChartDataSuccess = createAction(LOAD_CHART_DATA_SUCCESS);
export const loadChartDataError = createAction(LOAD_CHART_DATA_ERROR);

export const defaultState = {};

export default handleActions(
    {
        [LOAD_CHART_DATA]: (state, { payload: { field } }) => ({
            ...state,
            [field.name]: 'loading',
        }),
        [LOAD_CHART_DATA_SUCCESS]: (state, { payload: { name, data } }) => ({
            ...state,
            [name]: { data },
        }),
        [LOAD_CHART_DATA_ERROR]: (state, { payload: { name, error } }) => ({
            ...state,
            [name]: { error },
        }),
    },
    defaultState,
);

const isChartDataLoaded = (state, name) =>
    !!(state[name] && state[name] !== 'loading');

const getChartData = (state, name) => get(state, [name, 'data']);
const getChartError = (state, name) => get(state, [name, 'error']);

export const fromGraph = {
    isChartDataLoaded,
    getChartData,
    getChartError,
};
