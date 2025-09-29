import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
// @ts-expect-error TS7016
import { SCOPE_DATASET } from '../../../common/scope';

export const SET_CHARACTERISTIC_VALUE = 'SET_CHARACTERISTIC_VALUE';

export const UPDATE_CHARACTERISTICS = 'UPDATE_CHARACTERISTICS';
export const UPDATE_CHARACTERISTICS_ERROR = 'UPDATE_CHARACTERISTICS_ERROR';
export const UPDATE_CHARACTERISTICS_SUCCESS = 'UPDATE_CHARACTERISTICS_SUCCESS';

export const setCharacteristicValue = createAction(SET_CHARACTERISTIC_VALUE);
export const updateCharacteristics = createAction(UPDATE_CHARACTERISTICS);
export const updateCharacteristicsError = createAction(
    UPDATE_CHARACTERISTICS_ERROR,
);
export const updateCharacteristicsSuccess = createAction(
    UPDATE_CHARACTERISTICS_SUCCESS,
);

export const defaultState = {
    characteristics: [],
    error: null,
    newCharacteristics: null,
    isSaving: false,
    isAdding: false,
};

// @ts-expect-error TS2769
export default handleActions(
    {
        LOAD_PUBLICATION_SUCCESS: (
            state,
            { payload: { characteristics } },
        ) => ({
            ...state,
            characteristics,
            newCharacteristics: characteristics[0],
        }),
        SET_CHARACTERISTIC_VALUE: (
            { newCharacteristics, ...state },
            // @ts-expect-error TS7031
            { payload: { name, value } },
        ) => ({
            ...state,
            newCharacteristics: {
                // @ts-expect-error TS7006
                ...newCharacteristics,
                [name]: value,
            },
        }),
        UPDATE_CHARACTERISTICS: (state) => ({
            ...state,
            error: null,
            isSaving: true,
        }),
        UPDATE_CHARACTERISTICS_ERROR: (state, { payload: error }) => ({
            ...state,
            error,
            isSaving: false,
        }),
        UPDATE_CHARACTERISTICS_SUCCESS: (
            state,
            { payload: { characteristics } },
        ) => ({
            ...state,
            characteristics: [characteristics, ...state.characteristics],
            newCharacteristics: characteristics,
            error: null,
            isSaving: false,
        }),
    },
    defaultState,
);

// @ts-expect-error TS7006
const getCharacteristicError = (state) => state.error;

// @ts-expect-error TS7006
const getCharacteristicsAsResource = (state) => state.characteristics[0] || {};
// @ts-expect-error TS7006
const getNewCharacteristicsAsResource = (state) =>
    state.newCharacteristics || {};

// @ts-expect-error TS7006
const getParams = (state, params) => params;

const getCharacteristics = createSelector(
    getCharacteristicsAsResource,
    getParams,
    (characteristics, fields) =>
        // @ts-expect-error TS7006
        fields.map((field) => ({
            ...field,
            value: characteristics[field.name],
        })),
);

const getNewCharacteristics = createSelector(
    getNewCharacteristicsAsResource,
    getParams,
    (characteristics, fields) =>
        // @ts-expect-error TS7006
        fields.map((field) => ({
            ...field,
            value: characteristics[field.name],
        })),
);

const getRootCharacteristics = createSelector(
    getCharacteristicsAsResource,
    getParams,
    (characteristics, fields) =>
        fields
            // @ts-expect-error TS7006
            .map((field) => ({
                ...field,
                value: characteristics[field.name],
            }))
            .filter(
                // @ts-expect-error TS7006
                (field) =>
                    !field.completes &&
                    field.scope === SCOPE_DATASET &&
                    !!field.display,
            ),
);

const getCharacteristicByName = createSelector(
    getCharacteristicsAsResource,
    getParams,
    (characteristics, name) => characteristics[name],
);

// @ts-expect-error TS7006
const isSaving = (state) => state.isSaving;

// @ts-expect-error TS7006
const isAdding = (state) => state.isAdding;

// @ts-expect-error TS7006
const getError = (state) => state.error;

export const selectors = {
    getNewCharacteristics,
    getCharacteristicError,
    getCharacteristics,
    getCharacteristicsAsResource,
    getRootCharacteristics,
    getCharacteristicByName,
    isSaving,
    isAdding,
    getError,
};
