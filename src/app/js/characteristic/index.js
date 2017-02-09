import { createAction, handleActions } from 'redux-actions';

import TITLE_SCHEME from '../../../common/titleScheme';
import { LOAD_PUBLICATION_SUCCESS } from '../publication';

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
        newCharacteristics: characteristics,
    }),
    SET_CHARACTERISTIC_VALUE: ({ newCharacteristics, ...state }, { payload: { name, value } }) => {
        const index = newCharacteristics.findIndex(c => c.name === name);
        const characteristic = newCharacteristics.find(c => c.name === name);

        return {
            ...state,
            newCharacteristics: [
                ...newCharacteristics.splice(0, index),
                { ...characteristic, value },
                ...newCharacteristics.splice(index + 1),
            ],
        };
    },
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
        characteristics,
        newCharacteristics: characteristics,
        editing: false,
        error: null,
        updating: false,
    }),
}, defaultState);

export const getDatasetTitle = ({ characteristic: { characteristics } }) => {
    const titleCharacteristic = characteristics.find(({ scheme }) => scheme === TITLE_SCHEME);
    return titleCharacteristic ? titleCharacteristic.value : null;
};

export const getUpdateCharacteristicsRequest = state => ({
    url: '/api/characteristic',
    method: 'PUT',
    credentials: 'include',
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${state.user.token}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(state.characteristic.newCharacteristics.map(({ _id, value }) => ({ _id, value }))),
});
