import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { SCOPE_DATASET } from '@lodex/common';

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
type CharacteristicState = {
    characteristics: { language: string; [key: string]: unknown }[];
    error: string | null;
    newCharacteristics: unknown | null;
    isSaving: boolean;
    isAdding: boolean;
};

export const defaultState: CharacteristicState = {
    characteristics: [],
    error: null,
    newCharacteristics: null,
    isSaving: false,
    isAdding: false,
};

export default handleActions<CharacteristicState, any>(
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

const getCharacteristicError = (state: CharacteristicState) => state.error;

const getCharacteristicsAsResource = (
    state: CharacteristicState,
): Record<string, unknown> => state.characteristics[0] || {};

const getNewCharacteristicsAsResource = (state: CharacteristicState) =>
    state.newCharacteristics || {};

const getParams = <T>(_state: CharacteristicState, params: T): T => params;

const getCharacteristics = createSelector(
    getCharacteristicsAsResource,
    getParams<{ name: string }[]>,
    (characteristics, fields: { name: string }[]) =>
        fields.map((field) => ({
            ...field,
            value: characteristics[field.name],
        })),
);

const getNewCharacteristics = createSelector(
    getNewCharacteristicsAsResource,
    getParams<
        {
            name: string;
        }[]
    >,
    (characteristics, fields) =>
        fields.map((field) => ({
            ...field,
            // @ts-expect-error TS7053
            value: characteristics[field.name],
        })),
);

const getRootCharacteristics = createSelector(
    getCharacteristicsAsResource,
    getParams<
        {
            name: string;
            completes?: boolean;
            scope?: string;
            display?: boolean;
            language?: string;
        }[]
    >,
    (characteristics, fields) =>
        fields
            .map((field) => ({
                ...field,
                value: characteristics[field.name],
            }))
            .filter(
                (field) =>
                    !field.completes &&
                    field.scope === SCOPE_DATASET &&
                    !!field.display,
            ),
);

const getCharacteristicByName = createSelector(
    getCharacteristicsAsResource,
    getParams<string>,
    (characteristics, name) => characteristics[name],
);

const isSaving = (state: CharacteristicState) => state.isSaving;

const isAdding = (state: CharacteristicState) => state.isAdding;

const getError = (state: CharacteristicState) => state.error;

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
