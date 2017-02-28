import omit from 'lodash.omit';
import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

import { getTransformersMetas, getTransformerMetas } from '../../../../common/transformers';
import { COVER_COLLECTION } from '../../../../common/cover';
import { getProps } from '../../lib/selectors';

export const FIELD_FORM_NAME = 'field';

export const ADD_FIELD = 'ADD_FIELD';
export const ADD_FIELD_ERROR = 'ADD_FIELD_ERROR';
export const ADD_FIELD_SUCCESS = 'ADD_FIELD_SUCCESS';
export const EDIT_FIELD = 'EDIT_FIELD';
export const LOAD_FIELD = 'LOAD_FIELD';
export const LOAD_FIELD_SUCCESS = 'LOAD_FIELD_SUCCESS';
export const LOAD_FIELD_ERROR = 'LOAD_FIELD_ERROR';
export const REMOVE_FIELD = 'REMOVE_FIELD';
export const REMOVE_FIELD_ERROR = 'REMOVE_FIELD_ERROR';
export const REMOVE_FIELD_SUCCESS = 'REMOVE_FIELD_SUCCESS';
export const REFRESH_FIELD = 'REFRESH_FIELD';
export const SET_VALIDATION = 'SET_VALIDATION';
export const UPDATE_FIELD_ERROR = 'UPDATE_FIELD_ERROR';
export const UPDATE_FIELD_SUCCESS = 'UPDATE_FIELD_SUCCESS';

export const addField = createAction(ADD_FIELD);
export const addFieldError = createAction(ADD_FIELD_ERROR);
export const addFieldSuccess = createAction(ADD_FIELD_SUCCESS);
export const editField = createAction(EDIT_FIELD);
export const loadField = createAction(LOAD_FIELD);
export const loadFieldError = createAction(LOAD_FIELD_ERROR);
export const loadFieldSuccess = createAction(LOAD_FIELD_SUCCESS);
export const removeField = createAction(REMOVE_FIELD);
export const removeFieldError = createAction(REMOVE_FIELD_ERROR);
export const removeFieldSuccess = createAction(REMOVE_FIELD_SUCCESS);
export const refreshField = createAction(REFRESH_FIELD);
export const setValidation = createAction(SET_VALIDATION);
export const updateFieldError = createAction(UPDATE_FIELD_ERROR);
export const updateFieldSuccess = createAction(UPDATE_FIELD_SUCCESS);

export const defaultState = {
    byName: {},
    allValid: true,
    list: [],
    invalidFields: [],
    editedFieldName: null,
};

export default handleActions({
    ADD_FIELD_SUCCESS: (state, { payload }) => ({
        ...state,
        editedFieldName: payload.name,
        list: [...state.list, payload.name],
        byName: {
            ...state.byName,
            [payload.name]: payload,
        },
    }),
    LOAD_FIELD_SUCCESS: (state, { payload }) => ({
        ...state,
        list: payload.map(({ name }) => name),
        byName: payload.reduce((acc, field) => ({
            ...acc,
            [field.name]: field,
        }), {}),
    }),
    LOAD_FIELD_ERROR: () => defaultState,
    EDIT_FIELD: (state, { payload }) => ({
        ...state,
        editedFieldName: typeof payload === 'number' ? state.list[payload] : null,
    }),
    REMOVE_FIELD_SUCCESS: (state, { payload: { name: nameToRemove } }) => ({
        ...state,
        list: state.list.filter(name => name !== nameToRemove),
        byName: omit(state.byName, [nameToRemove]),
    }),
    UPDATE_FIELD_SUCCESS: (state, { payload }) => ({
        ...state,
        byName: {
            ...state.byName,
            [payload.name]: payload,
        },
    }),
    SET_VALIDATION: (state, { payload: { isValid: allValid, fields: invalidFields } }) => ({
        ...state,
        allValid,
        invalidFields,
    }),
}, defaultState);

const getFields = ({ byName, list }) => list.map(name => byName[name]);

const getNbFields = ({ list }) => list.length;

const getEditedField = state => state.byName[state.editedFieldName];

export const getCollectionFields = createSelector(
    getFields,
    fields => fields.filter(f => f.cover === COVER_COLLECTION),
);

export const getFieldByName = createSelector(
    getProps,
    getFields,
    (name, fields) => fields.find(f => f.name === name),
);

export const getFieldsExceptEdited = createSelector(
    getFields,
    getEditedField,
    (fields, editedField) => fields.filter(f => f._id !== editedField._id),
);


export const getCompletedField = createSelector(
    getProps,
    getFields,
    (field, fields) => fields.find(f => f.name === field.completes),
);

export const hasPublicationFields = ({ list }) => list.length > 0;

export const getTransformers = () => getTransformersMetas();

export const getTransformerArgs = (state, operation) => getTransformerMetas(operation);

export const getFieldFormData = state => state.form.field.values;

const getValidationFields = state => state.invalidFields;

export const getInvalidFields = createSelector(
    getFields,
    getValidationFields,
    (fields = [], validationFields = []) => validationFields
        .filter(({ isValid }) => !isValid)
        .map(field => ({
            ...field,
            index: fields.findIndex(f => f.name === field.name),
        })),
);

export const areAllFieldsValid = state => state.allValid;

export const selectors = {
    areAllFieldsValid,
    getCollectionFields,
    getCompletedField,
    getEditedField,
    getFieldByName,
    getFields,
    getFieldsExceptEdited,
    getInvalidFields,
    getNbFields,
    hasPublicationFields,
    getTransformers,
    getTransformerArgs,
};
