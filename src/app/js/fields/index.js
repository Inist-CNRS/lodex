import omit from 'lodash.omit';
import { createAction, handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';

import { getTransformersMetas, getTransformerMetas } from '../../../common/transformers';
import { COVER_COLLECTION, COVER_DOCUMENT, COVER_DATASET } from '../../../common/cover';
import { getProps } from '../lib/selectors';
import TITLE_SCHEME from '../../../common/titleScheme';
import getCatalogFromArray from '../lib/getCatalogFromArray'; import {
    UPDATE_CHARACTERISTICS_SUCCESS,
    ADD_CHARACTERISTIC_SUCCESS,
} from '../public/characteristic';
import { SAVE_RESOURCE_SUCCESS } from '../public/resource';

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

export const SELECT_FIELD = 'SELECT_FIELD';
export const CONFIGURE_FIELD = 'CONFIGURE_FIELD';
export const CONFIGURE_FIELD_OPEN = 'CONFIGURE_FIELD_OPEN';
export const CONFIGURE_FIELD_CANCEL = 'CONFIGURE_FIELD_CANCEL';
export const CONFIGURE_FIELD_SUCCESS = 'CONFIGURE_FIELD_SUCCESS';
export const CONFIGURE_FIELD_ERROR = 'CONFIGURE_FIELD_ERROR';
export const OPEN_EDIT_FIELD_VALUE = 'OPEN_EDIT_FIELD_VALUE';
export const CLOSE_EDIT_FIELD_VALUE = 'CLOSE_EDIT_FIELD_VALUE';

export const LOAD_PUBLICATION = 'LOAD_PUBLICATION';
export const LOAD_PUBLICATION_SUCCESS = 'LOAD_PUBLICATION_SUCCESS';
export const LOAD_PUBLICATION_ERROR = 'LOAD_PUBLICATION_ERROR';

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

export const selectField = createAction(SELECT_FIELD);
export const configureField = createAction(CONFIGURE_FIELD);
export const configureFieldOpen = createAction(CONFIGURE_FIELD_OPEN);
export const configureFieldCancel = createAction(CONFIGURE_FIELD_CANCEL);
export const configureFieldSuccess = createAction(CONFIGURE_FIELD_SUCCESS);
export const configureFieldError = createAction(CONFIGURE_FIELD_ERROR);
export const openEditFieldValue = createAction(OPEN_EDIT_FIELD_VALUE);
export const closeEditFieldValue = createAction(CLOSE_EDIT_FIELD_VALUE);
export const loadPublication = createAction(LOAD_PUBLICATION);
export const loadPublicationSuccess = createAction(LOAD_PUBLICATION_SUCCESS);
export const loadPublicationError = createAction(LOAD_PUBLICATION_ERROR);

export const defaultState = {
    loading: false,
    isSaving: false,
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
    transformers: name ? [{
        operation: 'COLUMN',
        args: [{
            name: 'column',
            type: 'column',
            value: name,
        }],
    }] : [],
    position: index,
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
            editedFieldName: typeof payload === 'number' ? state.list[payload] : payload,
        };
    },
    REMOVE_FIELD_SUCCESS: (state, { payload: { name: nameToRemove } }) => ({
        ...state,
        list: state.list.filter(name => name !== nameToRemove),
        byName: omit(state.byName, [nameToRemove]),
    }),
    SET_VALIDATION: (state, { payload: { isValid: allValid, fields: invalidFields } }) => ({
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
    CONFIGURE_FIELD_SUCCESS: (state, { payload: field }) => ({
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
    [ADD_CHARACTERISTIC_SUCCESS]: (state, { payload: { field } }) => ({
        ...state,
        list: [
            ...state.list,
            field.name,
        ],
        byName: {
            ...state.byName,
            [field.name]: field,
        },
    }),
    LOAD_PUBLICATION: state => ({
        ...state,
        error: null,
        loading: true,
    }),
    LOAD_PUBLICATION_SUCCESS: (state, { payload: { fields, published } }) => {
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
}, defaultState);

const getFields = ({ byName, list }) => list
    .map(name => byName[name])
    .sort((f1, f2) => f1.position - f2.position);

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
        if (editedIndex === null || !formData) {
            return fields;
        }

        return [
            ...fields.slice(0, editedIndex),
            formData,
            ...fields.slice(editedIndex + 1),
        ];
    },
);

const getParams = (_, params) => params;

const getEditedField = state => state.byName[state.editedFieldName];

export const getCollectionFields = createSelector(
    getFields,
    fields => fields.filter(f => f.cover === COVER_COLLECTION),
);

const getDocumentFields = createSelector(
    getFields,
    fields => fields
        .filter(f => f.display_in_resource || f.contribution)
        .filter(f => f.cover === COVER_DOCUMENT),
);

const getDatasetFields = createSelector(
    getFields,
    fields => fields.filter(f => f.cover === COVER_DATASET),
);

const getComposedFields = createSelector(
    getFields,
    fields => fields.filter(({ composedOf }) => !!composedOf),
);

export const isACompositeFields = (name, composedFields) =>
    composedFields.some(({ composedOf: { fields } }) => fields.includes(name));

const getCollectionFieldsExceptComposite = createSelector(
    getCollectionFields,
    getComposedFields,
    (allFields, composedFields) => allFields
        .filter(({ name }) => !isACompositeFields(name, composedFields)),
);

const getRootCollectionFields = createSelector(
    getCollectionFieldsExceptComposite,
    allFields => allFields
        .filter(f => f.display_in_resource || f.contribution)
        .filter(f => f.cover === COVER_COLLECTION && !f.completes),
);

const getResourceFields = createSelector(
    getParams,
    getDocumentFields,
    getRootCollectionFields,
    (resource, documentFields, collectionFields) => [
        ...collectionFields,
        ...documentFields.filter(({ name }) => !!resource[name]),
    ],
);

const getListFields = createSelector(
    getCollectionFields,
    fields => fields
        .filter(f => f.display_in_list || f.name === 'uri')
        .filter(f => !f.composedOf),
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

export const getTransformers = (state, type) => getTransformersMetas(type);

export const getTransformerArgs = (state, operation) => getTransformerMetas(operation).args;

export const getFieldOntologyFormData = state =>
    state.form.ONTOLOGY_FIELD_FORM && state.form.ONTOLOGY_FIELD_FORM.values;


export const getFieldFormData = (state) => {
    try {
        return state.form.field.values;
    } catch (error) {
        return undefined;
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

    return (line) => {
        const lineValue = line[field.name];
        return Array.isArray(lineValue) ? JSON.stringify(lineValue) : lineValue;
    };
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

const getFieldsCatalog = state => state.byName;

const getCompositeFieldsByField = createSelector(
    getFieldsCatalog,
    (_, field) => field,
    (fieldsCatalog, field) => {
        if (!field.composedOf) {
            return [];
        }
        const { fields } = field.composedOf;

        return fields.map(name => fieldsCatalog[name]);
    },
);

const getCompositeFieldsNamesByField = createSelector(
    getCompositeFieldsByField,
    fields => fields.map(({ label }) => label),
);

const hasPublishedDataset = ({ published }) => published;

const getContributionFields = createSelector(
    getFields,
    fields => fields.filter(f => f.contribution),
);

const getSelectedField = ({ selectedField }) => selectedField;

const getFieldToAdd = ({ byName, selectedField }) => {
    if (selectedField === 'new') {
        return { cover: 'document' };
    }
    const field = byName[selectedField];
    if (!field) {
        return null;
    }
    return omit(field, ['contributors', '_id']);
};

const getLinkedFields = createSelector(
    getFields,
    (getParams),
    (fields, fieldName) => fields.filter(f => f.completes && f.completes === fieldName),
);

const findTitleField = (fields) => {
    let titleField = fields
        .find(({ scheme }) => scheme === TITLE_SCHEME);

    if (!titleField) {
        titleField = fields
            .find(({ label }) => label.match(/^title$/));
    }

    return titleField ? titleField.name : null;
};

const getTitleFieldName = createSelector(
    getCollectionFields,
    findTitleField,
);

const getDatasetTitleFieldName = createSelector(
    getDatasetFields,
    findTitleField,
);

const getPublishData = ({ error, published, editedFieldIndex, loading }) => ({
    published,
    editedFieldIndex,
    loading,
    error: error && (error.message || error),
});

const isLoading = state => state.loading;
const isSaving = state => state.isSaving;
const getError = state => state.error;

const getFacetFields = createSelector(
    getFields,
    allFields => allFields.filter(f => f.isFacet),
);

const hasFacetFields = createSelector(
    getFacetFields,
    facetFields => facetFields.length > 0,
);

const hasSearchableFields = createSelector(
    getFields,
    allFields => allFields.filter(f => f.searchable).length > 0,
);

const getNbColumns = state => state.list.length;

const getEditedValueFieldName = ({ editedValueFieldName }) => editedValueFieldName;

const isFieldEdited = createSelector(
    getEditedValueFieldName,
    getParams,
    (editedFieldName, fieldName) => editedFieldName === fieldName,
);

const getConfiguredFieldName = ({ configuredFieldName }) => configuredFieldName;

const isFieldConfigured = createSelector(
    getConfiguredFieldName,
    (_, fieldName) => fieldName,
    (editedFieldName, fieldName) => editedFieldName === fieldName,
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
    getCompositeFieldsByField,
    getCompositeFieldsNamesByField,
    getListFields,
    getCollectionFieldsExceptComposite,
    getRootCollectionFields,
    getResourceFields,
    hasPublishedDataset,
    getContributionFields,
    getSelectedField,
    getFieldToAdd,
    getDocumentFields,
    getLinkedFields,
    getDatasetFields,
    getTitleFieldName,
    getDatasetTitleFieldName,
    getPublishData,
    isLoading,
    isSaving,
    getError,
    getFacetFields,
    hasFacetFields,
    hasSearchableFields,
    getNbColumns,
    getEditedValueFieldName,
    isFieldEdited,
    isFieldConfigured,
};
