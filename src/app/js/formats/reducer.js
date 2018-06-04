import { createAction, handleActions } from 'redux-actions';
import get from 'lodash.get';

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

// export const PRE_LOAD_FORMAT_DATA_SPARQL = 'PRE_LOAD_FORMAT_DATA_SPARQL';
// export const UN_LOAD_FORMAT_DATA_SPARQL = 'UN_LOAD_FORMAT_DATA_SPARQL';
// export const LOAD_FORMAT_DATA_SPARQL = 'LOAD_FORMAT_DATA_SPARQL';
// export const LOAD_FORMAT_DATA_SPARQL_SUCCESS =
//     'LOAD_FORMAT_DATA_SPARQL_SUCCESS';
// export const LOAD_FORMAT_DATA_SPARQL_ERROR = 'LOAD_FORMAT_DATA_SPARQL_ERROR';
//
// export const preLoadFormatDataSparql = createAction(
//     PRE_LOAD_FORMAT_DATA_SPARQL,
// );
// export const unLoadFormatDataSparql = createAction(UN_LOAD_FORMAT_DATA_SPARQL);
// export const loadFormatDataSparql = createAction(LOAD_FORMAT_DATA_SPARQL);
// export const loadFormatDataSparqlSuccess = createAction(
//     LOAD_FORMAT_DATA_SPARQL_SUCCESS,
// );
// export const loadFormatDataSparqlError = createAction(
//     LOAD_FORMAT_DATA_SPARQL_ERROR,
// );
export const defaultState = {};

export default handleActions(
    {
        [LOAD_FORMAT_DATA]: (state, { payload: { field } }) => ({
            ...state,
            [field.name]: 'loading',
        }),
        [LOAD_FORMAT_DATA_SUCCESS]: (state, { payload: { name, data } }) => {
            console.log('toto100', data); //eslint-disable-line
            return {
                ...state,
                [name]: { data },
            };
        },
        [LOAD_FORMAT_DATA_ERROR]: (state, { payload: { name, error } }) => ({
            ...state,
            [name]: { error },
        }),
        [UN_LOAD_FORMAT_DATA]: (state, { payload: { name } }) => ({
            ...state,
            [name]: null,
        }),
        // [LOAD_FORMAT_DATA_SPARQL]: (state, { payload: { field } }) => ({
        //     ...state,
        //     [field.name]: 'loading',
        // }),
        // [LOAD_FORMAT_DATA_SPARQL_SUCCESS]: (
        //     state,
        //     { payload: { name, data } },
        // ) => ({
        //     ...state,
        //     [name]: { data },
        // }),
        // [LOAD_FORMAT_DATA_SPARQL_ERROR]: (
        //     state,
        //     { payload: { name, error } },
        // ) => ({
        //     ...state,
        //     [name]: { error },
        // }),
        // [UN_LOAD_FORMAT_DATA_SPARQL]: (state, { payload: { name } }) => ({
        //     ...state,
        //     [name]: null,
        // }),
    },
    defaultState,
);

const isFormatDataLoaded = (state, name) => state[name] !== 'loading';

const getFormatData = (state, name) => get(state, [name, 'data']);
const getFormatError = (state, name) => get(state, [name, 'error']);

export const getCurrentFieldNames = state =>
    Object.keys(state).filter(key => !!state[key]);

export const fromFormat = {
    isFormatDataLoaded,
    getFormatData,
    getFormatError,
    getCurrentFieldNames,
};
