import omit from 'lodash.omit';
import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import pad from 'lodash.pad';

import { getTransformersMetas, getTransformerMetas } from '../../../../common/transformers';
import { COVER_COLLECTION } from '../../../../common/cover';
import { getProps } from '../../lib/selectors';

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

export const defaultState = {
    byName: {},
    allValid: true,
    list: [],
    invalidFields: [],
    editedFieldName: null,
    searchable: true,
};

const getDefaultField = (name, index) => ({
    cover: 'collection',
    label: name || `newField ${index + 1}`,
    name: 'new',
    display_in_list: true,
    display_in_resource: true,
    searchable: true,
    transformers: name ? [{
        operation: 'COLUMN',
        args: [{
            name: 'column',
            type: 'column',
            value: name,
        }],
    }] : [],
});

export default handleActions({
    ADD_FIELD: (state, { payload: name }) => ({
        ...state,
        editedFieldName: 'new',
        list: [...state.list, 'new'],
        byName: {
            ...state.byName,
            new: getDefaultField(name, state.list.length),
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
    EDIT_FIELD: (state, { payload }) => {
        if (!payload && state.editedFieldName === 'new') {
            return {
                ...state,
                editedFieldName: null,
                byName: omit(state.byName, ['new']),
                list: [...state.list.slice(0, -1)],
            };
        }
        return {
            ...state,
            editedFieldName: typeof payload === 'number' ? state.list[payload] : payload,
        };
    },
    REMOVE_FIELD_SUCCESS: (state, { payload: { name: nameToRemove } }) => ({
        ...state,
        list: state.list.filter(name => name !== nameToRemove),
        byName: omit(state.byName, [nameToRemove]),
    }),
    SAVE_FIELD_SUCCESS: (state, { payload }) => {
        if (state.editedFieldName === 'new') {
            const newIndex = state.list.indexOf('new');

            return {
                ...state,
                byName: {
                    ...omit(state.byName, ['new']),
                    [payload.name]: payload,
                },
                list: [
                    ...state.list.slice(0, newIndex),
                    payload.name,
                    ...state.list.slice(newIndex + 1),
                ],
                editedFieldName: null,
            };
        }

        return {
            ...state,
            byName: {
                ...state.byName,
                [payload.name]: payload,
            },
            editedFieldName: null,
        };
    },
    SET_VALIDATION: (state, { payload: { isValid: allValid, fields: invalidFields } }) => ({
        ...state,
        allValid,
        invalidFields,
    }),
}, defaultState);

const getFields = ({ byName, list }) => list.map(name => byName[name]);
const getByName = ({ byName }) => byName;

const getNbFields = ({ list }) => list.length;

const getEditedFieldIndex = (state) => {
    const index = state.list.indexOf(state.editedFieldName);
    return index === -1 ? null : index;
};

const getFieldsForPreview = createSelector(
    getFields,
    getEditedFieldIndex,
    (_, formData) => formData,
    (fields, editedIndex, formData) => {
        if (!editedIndex || !formData) {
            return fields;
        }

        return [
            ...fields.slice(0, editedIndex - 1),
            formData,
            ...fields.slice(editedIndex + 1),
        ];
    },
);

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

export const getFieldFormData = (state) => {
    try {
        return state.form.field.values;
    } catch (error) {
        return null;
    }
};

const getValidationFields = state => state.invalidFields;

export const getInvalidFields = createSelector(
    getByName,
    getValidationFields,
    (byName = {}, validationFields = []) => validationFields
        .filter(({ isValid }) => !isValid)
        .map(field => ({
            ...byName[field.name],
            ...field,
        })),
);

export const areAllFieldsValid = state => state.allValid;

export const getLineColGetterFromAllFields = (fieldByName, field) => {
    if (!field) {
        return () => null;
    }
    if (field.composedOf) {
        return (line) => {
            const { separator, fields } = field.composedOf;

            return fields
                .map((name) => {
                    if (!fieldByName[name]) {
                        throw new Error('circular dependencies');
                    }
                    const getLineCol = getLineColGetterFromAllFields(omit(fieldByName, [name]), fieldByName[name]);

                    return getLineCol(line);
                })
                .join(pad(separator, separator.length + 2));
        };
    }

    return line => line[field.name];
};

export const getLineColGetter = createSelector(
    getByName,
    (_, field) => field,
    (fieldByName, field) => {
        const getLineCol = getLineColGetterFromAllFields(fieldByName, field);
        return (line) => {
            try {
                return getLineCol(line);
            } catch (error) {
                if (error.message === 'circular dependencies') {
                    return 'circular dependencies';
                }
                throw error;
            }
        };
    },
);


export const selectors = {
    areAllFieldsValid,
    getCollectionFields,
    getCompletedField,
    getEditedField,
    getFieldsForPreview,
    getFieldByName,
    getFields,
    getFieldsExceptEdited,
    getInvalidFields,
    getNbFields,
    hasPublicationFields,
    getTransformers,
    getTransformerArgs,
    getLineColGetter,
};
