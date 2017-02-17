import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

import TITLE_SCHEME from '../../../../common/titleScheme';
import { COVER_DATASET } from '../../../../common/cover';

import { fromPublication } from '../../selectors';

export const TOGGLE_CHARACTERISTICS_EDITION = 'TOGGLE_CHARACTERISTICS_EDITION';
export const SET_CHARACTERISTIC_VALUE = 'SET_CHARACTERISTIC_VALUE';

export const UPDATE_CHARACTERISTICS = 'UPDATE_CHARACTERISTICS';
export const UPDATE_CHARACTERISTICS_ERROR = 'UPDATE_CHARACTERISTICS_ERROR';
export const UPDATE_CHARACTERISTICS_SUCCESS = 'UPDATE_CHARACTERISTICS_SUCCESS';

export const toggleCharacteristicsEdition = createAction(TOGGLE_CHARACTERISTICS_EDITION);
export const setCharacteristicValue = createAction(SET_CHARACTERISTIC_VALUE);
export const updateCharacteristics = createAction(UPDATE_CHARACTERISTICS);
export const updateCharacteristicsError = createAction(UPDATE_CHARACTERISTICS_ERROR);
export const updateCharacteristicsSuccess = createAction(UPDATE_CHARACTERISTICS_SUCCESS);

export const defaultState = {
    characteristics: [],
    editing: false,
    error: null,
    newCharacteristics: null,
    updating: false,
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
    TOGGLE_CHARACTERISTICS_EDITION: ({ editing, ...state }) => ({
        ...state,
        editing: !editing,
    }),
    UPDATE_CHARACTERISTICS: state => ({
        ...state,
        error: null,
        updating: true,
    }),
    UPDATE_CHARACTERISTICS_ERROR: (state, { payload: error }) => ({
        ...state,
        error,
    }),
    UPDATE_CHARACTERISTICS_SUCCESS: (state, { payload: characteristics }) => ({
        ...state,
        characteristics: [
            characteristics,
            ...state.characteristics,
        ],
        newCharacteristics: characteristics,
        editing: false,
        error: null,
        updating: false,
    }),
}, defaultState);

export const getDatasetTitle = ({ publication: { fields }, characteristic: { characteristics } }) => {
    const titleCharacteristic = fields.find(({ cover, scheme }) =>
        cover === COVER_DATASET && scheme === TITLE_SCHEME);

    return titleCharacteristic && characteristics[titleCharacteristic.name]
        ? characteristics[titleCharacteristic.name]
        : null;
};

const getCharacteristics = state => state.characteristic.characteristics[0] || {};

export const getCharacteristicsLastVersion = createSelector(
    getCharacteristics,
    fromPublication.getDatasetFields,
    (characteristic, fields) => fields
        .map(({ name, scheme }) => ({
            name,
            scheme,
            value: characteristic[name],
        })),
);

const selectNewCharacteristics = state => state.characteristic.newCharacteristics || {};

export const getNewCharacteristics = createSelector(
    selectNewCharacteristics,
    fromPublication.getDatasetFields,
    (newCharacteristics, fields) => fields
        .map(({ name, scheme }) => ({
            name,
            scheme,
            value: newCharacteristics[name],
        })),
);

export const isCharacteristicEditing = state => state.characteristic.editing;
export const isCharacteristicUpdating = state => state.characteristic.updating;
export const getCharacteristicError = state => state.characteristic.error;
