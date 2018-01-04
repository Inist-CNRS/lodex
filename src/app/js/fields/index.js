import omit from 'lodash.omit';
import { createAction, handleActions, combineActions } from 'redux-actions';

import getCatalogFromArray from '../lib/getCatalogFromArray';
import { UPDATE_CHARACTERISTICS_SUCCESS } from '../public/characteristic';
import {
    SAVE_RESOURCE_SUCCESS,
    ADD_FIELD_TO_RESOURCE_SUCCESS,
} from '../public/resource';
import fieldSelectors, {
    NEW_CHARACTERISTIC_FORM_NAME as formName,
} from './selectors';

export const selectors = fieldSelectors;
export const NEW_CHARACTERISTIC_FORM_NAME = formName;

export const FIELD_FORM_NAME = 'field';

export const ADD_FIELD = 'ADD_FIELD';
export const EDIT_FIELD = 'EDIT_FIELD';
export const LOAD_FIELD = 'LOAD_FIELD';
export const LOAD_FIELD_SUCCESS = 'LOAD_FIELD_SUCCESS';
export const LOAD_FIELD_ERROR = 'LOAD_FIELD_ERROR';
export const REMOVE_FIELD = 'REMOVE_FIELD';
export const REMOVE_FIELD_ERROR = 'REMOVE_FIELD_ERROR';
export const REMOVE_FIELD_SUCCESS = 'REMOVE_FIELD_SUCCESS';
export const REFRESH_FIELD = 'REFRESH_FIELD';
export const SET_VALIDATION = 'SET_VALIDATION';
export const SAVE_FIELD = 'SAVE_FIELD';
export const SAVE_FIELD_ERROR = 'SAVE_FIELD_ERROR';
export const SAVE_FIELD_SUCCESS = 'SAVE_FIELD_SUCCESS';
export const CHANGE_OPERATION = 'CHANGE_OPERATION';
export const CHANGE_POSITION = 'CHANGE_POSITION';
export const CHANGE_POSITION_VALUE = 'CHANGE_POSITION_VALUE';
export const CHANGE_CLASS = 'CHANGE_CLASS';

export const SELECT_FIELD = 'SELECT_FIELD';
export const CONFIGURE_FIELD = 'CONFIGURE_FIELD';
export const CONFIGURE_FIELD_OPEN = 'CONFIGURE_FIELD_OPEN';
export const CONFIGURE_FIELD_CANCEL = 'CONFIGURE_FIELD_CANCEL';
export const CONFIGURE_FIELD_SUCCESS = 'CONFIGURE_FIELD_SUCCESS';
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
export const editField = createAction(EDIT_FIELD);
export const loadField = createAction(LOAD_FIELD);
export const loadFieldError = createAction(LOAD_FIELD_ERROR);
export const loadFieldSuccess = createAction(LOAD_FIELD_SUCCESS);
export const removeField = createAction(REMOVE_FIELD);
export const removeFieldError = createAction(REMOVE_FIELD_ERROR);
export const removeFieldSuccess = createAction(REMOVE_FIELD_SUCCESS);
export const refreshField = createAction(REFRESH_FIELD);
export const setValidation = createAction(SET_VALIDATION);
export const saveField = createAction(SAVE_FIELD);
export const saveFieldError = createAction(SAVE_FIELD_ERROR);
export const saveFieldSuccess = createAction(SAVE_FIELD_SUCCESS);
export const changeOperation = createAction(CHANGE_OPERATION);
export const changePosition = createAction(CHANGE_POSITION);
export const changePositionValue = createAction(CHANGE_POSITION_VALUE);
export const changeClass = createAction(CHANGE_CLASS);

export const selectField = createAction(SELECT_FIELD);
export const configureField = createAction(CONFIGURE_FIELD);
export const configureFieldOpen = createAction(CONFIGURE_FIELD_OPEN);
export const configureFieldCancel = createAction(CONFIGURE_FIELD_CANCEL);
export const configureFieldSuccess = createAction(CONFIGURE_FIELD_SUCCESS);
export const configureFieldError = createAction(CONFIGURE_FIELD_ERROR);
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
    editedFieldName: undefined,
    editedValueFieldName: null,
    configuredFieldName: null,
    published: false,
};

const getDefaultField = (name, index) => ({
    cover: 'collection',
    label: name || `newField ${index + 1}`,
    name: 'new',
    display_in_list: true,
    display_in_resource: true,
    searchable: true,
    transformers: name
        ? [
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
          ]
        : [],
    classes: [],
    position: index,
    overview: 0,
});

export default handleActions(
    {
        ADD_FIELD: (state, { payload: name }) => ({
            ...state,
            editedFieldName: 'new',
            list: [...state.list, 'new'],
            byName: {
                ...state.byName,
                new: getDefaultField(name, state.list.length),
            },
        }),
        LOAD_FIELD: state => ({ ...state, loading: true }),
        LOAD_FIELD_SUCCESS: (state, { payload: fields }) => {
            const { catalog, list } = getCatalogFromArray(fields, 'name');

            return {
                ...state,
                editedFieldName: undefined,
                list,
                byName: catalog,
                loading: false,
            };
        },
        LOAD_FIELD_ERROR: () => defaultState,
        EDIT_FIELD: (state, { payload }) => {
            if (!payload && state.editedFieldName === 'new') {
                return {
                    ...state,
                    editedFieldName: undefined,
                    byName: omit(state.byName, ['new']),
                    list: [...state.list.slice(0, -1)],
                };
            }
            return {
                ...state,
                editedFieldName:
                    typeof payload === 'number' ? state.list[payload] : payload,
            };
        },
        REMOVE_FIELD_SUCCESS: (state, { payload: { name: nameToRemove } }) => ({
            ...state,
            list: state.list.filter(name => name !== nameToRemove),
            byName: omit(state.byName, [nameToRemove]),
        }),
        SET_VALIDATION: (
            state,
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
        CONFIGURE_FIELD: state => ({
            ...state,
            error: null,
            isSaving: true,
        }),
        CONFIGURE_FIELD_SUCCESS: (state, { payload: { field } }) => ({
            ...state,
            isSaving: false,
            error: null,
            configuredFieldName: null,
            byName: {
                ...state.byName,
                [field.name]: field,
            },
        }),
        CONFIGURE_FIELD_ERROR: (state, { payload: error }) => ({
            ...state,
            isSaving: false,
            error: error.message,
        }),
        CONFIGURE_FIELD_OPEN: (state, { payload: configuredFieldName }) => ({
            ...state,
            configuredFieldName,
            error: null,
        }),
        CONFIGURE_FIELD_CANCEL: state => ({
            ...state,
            configuredFieldName: null,
            error: null,
        }),
        OPEN_EDIT_FIELD_VALUE: (state, { payload: editedValueFieldName }) => ({
            ...state,
            editedValueFieldName,
            error: null,
        }),
        [combineActions(
            CLOSE_EDIT_FIELD_VALUE,
            UPDATE_CHARACTERISTICS_SUCCESS,
            SAVE_RESOURCE_SUCCESS,
        )]: state => ({
            ...state,
            editedValueFieldName: null,
        }),
        [combineActions(
            ADD_CHARACTERISTIC_SUCCESS,
            ADD_FIELD_TO_RESOURCE_SUCCESS,
        )]: (state, { payload: { field } }) => ({
            ...state,
            list: [...state.list, field.name],
            byName: {
                ...state.byName,
                [field.name]: field,
            },
            isAdding: false,
            isSaving: false,
            error: null,
        }),
        CHANGE_POSITION_VALUE: (state, { payload: { fields } }) => {
            const result = state.byName;
            fields.forEach(e => {
                result[e.name].position = e.position;
            });
            return {
                ...state,
                byName: {
                    ...result,
                },
            };
        },
        LOAD_PUBLICATION: state => ({
            ...state,
            error: null,
            loading: true,
        }),
        LOAD_PUBLICATION_SUCCESS: (
            state,
            { payload: { fields, published } },
        ) => {
            const { catalog, list } = getCatalogFromArray(fields, 'name');

            return {
                ...state,
                error: null,
                loading: false,
                byName: catalog,
                list,
                published,
                editedValueFieldName: null,
            };
        },
        LOAD_PUBLICATION_ERROR: (state, { payload: error }) => ({
            ...state,
            error: error.message,
            loading: false,
        }),
        [ADD_CHARACTERISTIC]: state => ({
            ...state,
            error: null,
            isSaving: true,
        }),
        [ADD_CHARACTERISTIC_OPEN]: state => ({
            ...state,
            isAdding: true,
            error: null,
        }),
        [ADD_CHARACTERISTIC_ERROR]: (state, { payload: error }) => ({
            ...state,
            isSaving: false,
            error,
        }),
        [ADD_CHARACTERISTIC_CANCEL]: state => ({
            ...state,
            isAdding: false,
            error: null,
        }),
    },
    defaultState,
);
