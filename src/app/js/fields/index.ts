import omit from 'lodash/omit';
import uniq from 'lodash/uniq';
import { combineActions, createAction, handleActions } from 'redux-actions';

import getCatalogFromArray from '../../../common/fields/getCatalogFromArray';
import { UPDATE_CHARACTERISTICS_SUCCESS } from '../characteristic';
import {
    ADD_FIELD_TO_RESOURCE_SUCCESS,
    SAVE_RESOURCE_SUCCESS,
} from '../public/resource';
import fieldSelectors, {
    NEW_CHARACTERISTIC_FORM_NAME as formName,
} from './selectors';

export const selectors = fieldSelectors;
export const NEW_CHARACTERISTIC_FORM_NAME = formName;

export const FIELD_FORM_NAME = 'field';

export const ADD_FIELD = 'ADD_FIELD';
export const LOAD_FIELD = 'LOAD_FIELD';
export const LOAD_FIELD_SUCCESS = 'LOAD_FIELD_SUCCESS';
export const LOAD_FIELD_ERROR = 'LOAD_FIELD_ERROR';
export const REMOVE_FIELD = 'REMOVE_FIELD';
export const REMOVE_FIELD_ERROR = 'REMOVE_FIELD_ERROR';
export const REMOVE_FIELD_SUCCESS = 'REMOVE_FIELD_SUCCESS';
export const REMOVE_FIELD_LIST = 'REMOVE_FIELD_LIST';
export const REMOVE_FIELD_LIST_STARTED = 'REMOVE_FIELD_LIST_STARTED';
export const REMOVE_FIELD_LIST_ERROR = 'REMOVE_FIELD_LIST_ERROR';
export const REMOVE_FIELD_LIST_SUCCESS = 'REMOVE_FIELD_LIST_SUCCESS';
export const REFRESH_FIELD = 'REFRESH_FIELD';
export const SET_VALIDATION = 'SET_VALIDATION';
export const SAVE_FIELD_FROM_DATA = 'SAVE_FIELD_FROM_DATA';
export const SAVE_FIELD = 'SAVE_FIELD';
export const SAVE_FIELD_ERROR = 'SAVE_FIELD_ERROR';
export const SAVE_FIELD_SUCCESS = 'SAVE_FIELD_SUCCESS';
export const CHANGE_POSITION_VALUE = 'CHANGE_POSITION_VALUE';
export const CHANGE_POSITIONS = 'CHANGE_POSITIONS';
export const CHANGE_CLASS = 'CHANGE_CLASS';

export const SELECT_FIELD = 'SELECT_FIELD';
export const CONFIGURE_FIELD = 'CONFIGURE_FIELD';
export const CONFIGURE_FIELD_OPEN = 'CONFIGURE_FIELD_OPEN';
export const CONFIGURE_FIELD_CANCEL = 'CONFIGURE_FIELD_CANCEL';
export const CONFIGURE_FIELD_SUCCESS = 'CONFIGURE_FIELD_SUCCESS';
export const FIELD_INVALID = 'FIELD_INVALID';
export const CONFIGURE_FIELD_ERROR = 'CONFIGURE_FIELD_ERROR';
export const OPEN_EDIT_FIELD_VALUE = 'OPEN_EDIT_FIELD_VALUE';
export const CLOSE_EDIT_FIELD_VALUE = 'CLOSE_EDIT_FIELD_VALUE';

export const PRE_LOAD_PUBLICATION = 'PRE_LOAD_PUBLICATION';
export const LOAD_PUBLICATION = 'LOAD_PUBLICATION';
export const LOAD_PUBLICATION_SUCCESS = 'LOAD_PUBLICATION_SUCCESS';
export const LOAD_PUBLICATION_ERROR = 'LOAD_PUBLICATION_ERROR';

export const ADD_CHARACTERISTIC = 'ADD_CHARACTERISTIC';
export const ADD_CHARACTERISTIC_OPEN = 'ADD_CHARACTERISTIC_OPEN';
export const ADD_CHARACTERISTIC_SUCCESS = 'ADD_CHARACTERISTIC_SUCCESS';
export const ADD_CHARACTERISTIC_ERROR = 'ADD_CHARACTERISTIC_ERROR';
export const ADD_CHARACTERISTIC_CANCEL = 'ADD_CHARACTERISTIC_CANCEL';

export const addField = createAction(ADD_FIELD);
export const loadField = createAction(LOAD_FIELD);
export const loadFieldError = createAction(LOAD_FIELD_ERROR);
export const loadFieldSuccess = createAction(LOAD_FIELD_SUCCESS);
export const removeField = createAction(REMOVE_FIELD);
export const removeFieldError = createAction(REMOVE_FIELD_ERROR);
export const removeFieldSuccess = createAction(REMOVE_FIELD_SUCCESS);
export const removeFieldList = createAction(REMOVE_FIELD_LIST);
export const removeFieldListStarted = createAction(REMOVE_FIELD_LIST_STARTED);
export const removeFieldListError = createAction(REMOVE_FIELD_LIST_ERROR);
export const removeFieldListSuccess = createAction(REMOVE_FIELD_LIST_SUCCESS);
export const refreshField = createAction(REFRESH_FIELD);
export const setValidation = createAction(SET_VALIDATION);
export const saveField = createAction(SAVE_FIELD);
export const saveFieldFromData = createAction(SAVE_FIELD_FROM_DATA);
export const saveFieldError = createAction(SAVE_FIELD_ERROR);
export const saveFieldSuccess = createAction(SAVE_FIELD_SUCCESS);
export const changePositionValue = createAction(CHANGE_POSITION_VALUE);
export const changePositions = createAction(CHANGE_POSITIONS);
export const changeClass = createAction(CHANGE_CLASS);

export const selectField = createAction(SELECT_FIELD);
export const configureField = createAction(CONFIGURE_FIELD);
export const configureFieldOpen = createAction(CONFIGURE_FIELD_OPEN);
export const configureFieldCancel = createAction(CONFIGURE_FIELD_CANCEL);
export const configureFieldSuccess = createAction(CONFIGURE_FIELD_SUCCESS);
export const configureFieldError = createAction(CONFIGURE_FIELD_ERROR);
export const fieldInvalid = createAction(FIELD_INVALID);
export const openEditFieldValue = createAction(OPEN_EDIT_FIELD_VALUE);
export const closeEditFieldValue = createAction(CLOSE_EDIT_FIELD_VALUE);
export const preLoadPublication = createAction(PRE_LOAD_PUBLICATION);
export const loadPublication = createAction(LOAD_PUBLICATION);
export const loadPublicationSuccess = createAction(LOAD_PUBLICATION_SUCCESS);
export const loadPublicationError = createAction(LOAD_PUBLICATION_ERROR);

export const addCharacteristic = createAction(ADD_CHARACTERISTIC);
export const addCharacteristicOpen = createAction(ADD_CHARACTERISTIC_OPEN);
export const addCharacteristicSuccess = createAction(
    ADD_CHARACTERISTIC_SUCCESS,
);
export const addCharacteristicError = createAction(ADD_CHARACTERISTIC_ERROR);
export const addCharacteristicCancel = createAction(ADD_CHARACTERISTIC_CANCEL);

export const defaultState = {
    loading: false,
    isSaving: false,
    isAdding: false,
    byName: {},
    allValid: true,
    list: [],
    invalidFields: [],
    editedValueFieldName: null,
    configuredFieldName: null,
    published: false,
    invalidProperties: [],
};

// @ts-expect-error TS7006
const getTransformers = (name, subresourcePath) => {
    if (subresourcePath && name) {
        return [
            {
                operation: 'COLUMN',
                args: [
                    {
                        name: 'column',
                        type: 'column',
                        value: subresourcePath,
                    },
                ],
            },
            {
                operation: 'PARSE',
            },
            {
                operation: 'GET',
                args: [{ name: 'path', type: 'string', value: name }],
            },
        ];
    }
    if (name) {
        return [
            {
                operation: 'COLUMN',
                args: [
                    {
                        name: 'column',
                        type: 'column',
                        value: name,
                    },
                ],
            },
        ];
    }
    return [];
};

const getDefaultField = (
    // @ts-expect-error TS7006
    name,
    // @ts-expect-error TS7006
    index,
    // @ts-expect-error TS7006
    scope,
    // @ts-expect-error TS7006
    subresourceId,
    // @ts-expect-error TS7006
    subresourcePath,
) => ({
    label: name || `newField ${index + 1}`,
    name: 'new',
    display: true,
    searchable: false,
    transformers: getTransformers(name, subresourcePath),
    classes: [],
    position: index,
    overview: 0,
    scope,
    subresourceId,
});

// @ts-expect-error TS2769
export default handleActions(
    {
        ADD_FIELD: (state, { payload }) => {
            // @ts-expect-error TS7006
            const { name, scope, subresourceId, subresourcePath } =
                payload || {};
            return {
                ...state,
                list: [...state.list, 'new'],
                byName: {
                    ...state.byName,
                    new: getDefaultField(
                        name,
                        state.list.length,
                        scope,
                        subresourceId,
                        subresourcePath,
                    ),
                },
            };
        },
        LOAD_FIELD: (state) => ({ ...state, loading: true }),
        LOAD_FIELD_SUCCESS: (state, { payload: fields }) => {
            const { catalog, list } = getCatalogFromArray(fields, 'name');

            return {
                ...state,
                list,
                byName: catalog,
                loading: false,
            };
        },
        LOAD_FIELD_ERROR: () => defaultState,
        // @ts-expect-error TS7006
        REMOVE_FIELD_SUCCESS: (state, { payload: { name: nameToRemove } }) => ({
            ...state,
            list: state.list.filter((name) => name !== nameToRemove),
            byName: omit(state.byName, [nameToRemove]),
        }),
        SET_VALIDATION: (
            state,
            // @ts-expect-error TS7031
            { payload: { isValid: allValid, fields: invalidFields } },
        ) => ({
            ...state,
            allValid,
            invalidFields,
        }),
        SELECT_FIELD: (state, { payload: name }) => ({
            ...state,
            selectedField: name,
        }),
        CONFIGURE_FIELD: (state) => ({
            ...state,
            error: null,
            isSaving: true,
            invalidProperties: [],
        }),
        // @ts-expect-error TS7006
        CONFIGURE_FIELD_SUCCESS: (state, { payload: { field } }) => ({
            ...state,
            isSaving: false,
            error: null,
            configuredFieldName: null,
            byName: {
                ...state.byName,
                [field.name]: field,
            },
            invalidProperties: [],
        }),
        CONFIGURE_FIELD_ERROR: (state, { payload: error }) => ({
            ...state,
            isSaving: false,
            // @ts-expect-error TS7031
            error: error.message,
        }),
        FIELD_INVALID: (state, { payload: { invalidProperties } }) => ({
            ...state,
            isSaving: false,
            invalidProperties,
        }),
        CONFIGURE_FIELD_OPEN: (state, { payload: configuredFieldName }) => ({
            ...state,
            configuredFieldName,
            error: null,
        }),
        CONFIGURE_FIELD_CANCEL: (state) => ({
            ...state,
            invalidProperties: [],
            configuredFieldName: null,
            error: null,
        }),
        OPEN_EDIT_FIELD_VALUE: (state, { payload: editedValueFieldName }) => ({
            ...state,
            editedValueFieldName,
            error: null,
        }),
        // @ts-expect-error TS7006
        [combineActions(
            CLOSE_EDIT_FIELD_VALUE,
            UPDATE_CHARACTERISTICS_SUCCESS,
            SAVE_RESOURCE_SUCCESS,
            // @ts-expect-error TS7006
        )]: (state) => ({
            ...state,
            editedValueFieldName: null,
        }),
        // @ts-expect-error TS7006
        [combineActions(
            ADD_CHARACTERISTIC_SUCCESS,
            ADD_FIELD_TO_RESOURCE_SUCCESS,
            // @ts-expect-error TS7006
        )]: (state, { payload: { field } }) => ({
            ...state,
            list: uniq([...state.list, field.name]),
            byName: {
                ...state.byName,
                [field.name]: field,
            },
            invalidProperties: [],
            isAdding: false,
            isSaving: false,
            error: null,
        }),
        // @ts-expect-error TS7006
        CHANGE_POSITION_VALUE: (state, { payload: { fields } }) => ({
            ...state,
            byName: fields.reduce(
                // @ts-expect-error TS7006
                (acc, field) => ({
                    ...acc,
                    [field.name]: {
                        ...acc[field.name],
                        position: field.position,
                    },
                }),
                state.byName,
            ),
        }),
        LOAD_PUBLICATION: (state) => ({
            ...state,
            error: null,
            loading: true,
        }),
        LOAD_PUBLICATION_SUCCESS: (
            state,
            // @ts-expect-error TS7031
            { payload: { fields, published } },
        ) => {
            const { catalog, list } = getCatalogFromArray(fields, 'name');
            // @ts-expect-error TS7006
            const newField = state.byName.new;

            return {
                ...state,
                error: null,
                loading: false,
                byName: newField ? { ...catalog, new: newField } : catalog,
                list: newField ? [...list, 'new'] : list,
                published,
                editedValueFieldName: null,
            };
        },
        LOAD_PUBLICATION_ERROR: (state, { payload: error }) => ({
            ...state,
            // @ts-expect-error TS7031
            error: error.message,
            loading: false,
        }),
        [ADD_CHARACTERISTIC]: (state) => ({
            ...state,
            error: null,
            isSaving: true,
            invalidProperties: [],
        }),
        [ADD_CHARACTERISTIC_OPEN]: (state) => ({
            ...state,
            isAdding: true,
            error: null,
        }),
        [ADD_CHARACTERISTIC_ERROR]: (state, { payload: error }) => ({
            ...state,
            isSaving: false,
            error,
        }),
        [ADD_CHARACTERISTIC_CANCEL]: (state) => ({
            ...state,
            isAdding: false,
            error: null,
            invalidProperties: [],
        }),
        [REMOVE_FIELD_LIST_STARTED]: (state) => ({
            ...state,
            isRemoveFieldListPending: true,
        }),
        // @ts-expect-error TS7006
        [combineActions(REMOVE_FIELD_LIST_ERROR, REMOVE_FIELD_LIST_SUCCESS)]: (
            // @ts-expect-error TS7006
            state,
        ) => ({
            ...state,
            isRemoveFieldListPending: false,
        }),
    },
    defaultState,
);
