import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const NEW_CHARACTERISTIC_FORM_NAME = 'NEW_CHARACTERISTIC_FORM_NAME';

export const SET_CHARACTERISTIC_VALUE = 'SET_CHARACTERISTIC_VALUE';

export const UPDATE_CHARACTERISTICS = 'UPDATE_CHARACTERISTICS';
export const UPDATE_CHARACTERISTICS_ERROR = 'UPDATE_CHARACTERISTICS_ERROR';
export const UPDATE_CHARACTERISTICS_SUCCESS = 'UPDATE_CHARACTERISTICS_SUCCESS';

export const ADD_CHARACTERISTIC = 'ADD_CHARACTERISTIC';
export const ADD_CHARACTERISTIC_OPEN = 'ADD_CHARACTERISTIC_OPEN';
export const ADD_CHARACTERISTIC_SUCCESS = 'ADD_CHARACTERISTIC_SUCCESS';
export const ADD_CHARACTERISTIC_ERROR = 'ADD_CHARACTERISTIC_ERROR';
export const ADD_CHARACTERISTIC_CANCEL = 'ADD_CHARACTERISTIC_CANCEL';

export const setCharacteristicValue = createAction(SET_CHARACTERISTIC_VALUE);
export const updateCharacteristics = createAction(UPDATE_CHARACTERISTICS);
export const updateCharacteristicsError = createAction(UPDATE_CHARACTERISTICS_ERROR);
export const updateCharacteristicsSuccess = createAction(UPDATE_CHARACTERISTICS_SUCCESS);

export const addCharacteristic = createAction(ADD_CHARACTERISTIC);
export const addCharacteristicOpen = createAction(ADD_CHARACTERISTIC_OPEN);
export const addCharacteristicSuccess = createAction(ADD_CHARACTERISTIC_SUCCESS);
export const addCharacteristicError = createAction(ADD_CHARACTERISTIC_ERROR);
export const addCharacteristicCancel = createAction(ADD_CHARACTERISTIC_CANCEL);

export const defaultState = {
    characteristics: [],
    error: null,
    newCharacteristics: null,
    isSaving: false,
    isAdding: false,
};

export default handleActions({
    LOAD_PUBLICATION_SUCCESS: (state, { payload: { characteristics } }) => ({
        ...state,
        characteristics,
        newCharacteristics: characteristics[0],
    }),
    SET_CHARACTERISTIC_VALUE: ({ newCharacteristics, ...state }, { payload: { name, value } }) => ({
        ...state,
        newCharacteristics: {
            ...newCharacteristics,
            [name]: value,
        },
    }),
    UPDATE_CHARACTERISTICS: state => ({
        ...state,
        error: null,
        isSaving: true,
    }),
    UPDATE_CHARACTERISTICS_ERROR: (state, { payload: error }) => ({
        ...state,
        error,
        isSaving: false,
    }),
    UPDATE_CHARACTERISTICS_SUCCESS: (state, { payload: characteristics }) => ({
        ...state,
        characteristics: [
            characteristics,
            ...state.characteristics,
        ],
        newCharacteristics: characteristics,
        error: null,
        isSaving: false,
    }),
    ADD_CHARACTERISTIC: state => ({
        ...state,
        error: null,
        isSaving: true,
    }),
    ADD_CHARACTERISTIC_OPEN: state => ({
        ...state,
        isAdding: true,
        error: null,
    }),
    ADD_CHARACTERISTIC_SUCCESS: (state, { payload: { characteristics } }) => ({
        ...state,
        characteristics: [
            characteristics,
            ...state.characteristics,
        ],
        newCharacteristics: characteristics,
        isAdding: false,
        isSaving: false,
        error: null,
    }),
    ADD_CHARACTERISTIC_ERROR: (state, { payload: error }) => ({
        ...state,
        isSaving: false,
        error,
    }),
    ADD_CHARACTERISTIC_CANCEL: state => ({
        ...state,
        isAdding: false,
        error: null,
    }),
}, defaultState);

const getCharacteristicError = state => state.error;

const getCharacteristicsAsResource = state => state.characteristics[0] || {};
const getNewCharacteristicsAsResource = state => state.newCharacteristics || {};

const getParams = (state, params) => params;

const getCharacteristics = createSelector(
    getCharacteristicsAsResource,
    getParams,
    (characteristics, fields) => fields
            .map(field => ({
                ...field,
                value: characteristics[field.name],
            })),
);

const getNewCharacteristics = createSelector(
    getNewCharacteristicsAsResource,
    getParams,
    (characteristics, fields) => fields
            .map(field => ({
                ...field,
                value: characteristics[field.name],
            })),
);

const getRootCharacteristics = createSelector(
    getCharacteristicsAsResource,
    getParams,
    (characteristics, fields) => fields
            .map(field => ({
                ...field,
                value: characteristics[field.name],
            }))
            .filter(field => !field.completes),
);

const isSaving = state => state.isSaving;

const isAdding = state => state.isAdding;

const getError = state => state.error;

export const getNewCharacteristicFormData = state => state.form[NEW_CHARACTERISTIC_FORM_NAME].values;

export const fromCharacteristic = {
    getNewCharacteristics,
    getCharacteristicError,
    getCharacteristics,
    getCharacteristicsAsResource,
    getRootCharacteristics,
    isSaving,
    isAdding,
    getError,
};
