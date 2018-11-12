import omit from 'lodash.omit';
import { createSelector } from 'reselect';
import get from 'lodash.get';

import {
    getTransformersMetas,
    getTransformerMetas,
} from '../../../common/transformers';
import {
    COVER_COLLECTION,
    COVER_DOCUMENT,
    COVER_DATASET,
} from '../../../common/cover';
import * as overview from '../../../common/overview';
import { getProps } from '../lib/selectors';

export const NEW_CHARACTERISTIC_FORM_NAME = 'NEW_CHARACTERISTIC_FORM_NAME';

export const getFields = ({ byName, list = [] }) =>
    list.map(name => byName[name]).sort((f1, f2) => f1.position - f2.position);

const getOntologyFields = createSelector(
    getFields,
    (_, type) => type,
    (fields, type) =>
        type === COVER_DATASET
            ? fields.filter(({ cover }) => cover === COVER_DATASET)
            : fields.filter(({ cover }) => cover !== COVER_DATASET),
);

const getState = state => state.list;
const getByName = ({ byName }) => byName;

const getNbFields = ({ list }) => list.length;

const getEditedFieldIndex = state => {
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

export const getCollectionFields = createSelector(getFields, fields =>
    fields.filter(f => f.cover === COVER_COLLECTION),
);

const getDocumentFields = createSelector(getFields, fields =>
    fields
        .filter(f => f.display_in_resource || f.contribution)
        .filter(f => f.cover === COVER_DOCUMENT),
);

const getDatasetFields = createSelector(getFields, fields =>
    fields.filter(f => f.cover === COVER_DATASET),
);

const getComposedFields = createSelector(getFields, fields =>
    fields.filter(({ composedOf }) => !!composedOf),
);

export const isACompositeFields = (name, composedFields) =>
    composedFields.some(({ composedOf: { fields } }) => fields.includes(name));

const getCollectionFieldsExceptComposite = createSelector(
    getCollectionFields,
    getComposedFields,
    (allFields, composedFields) =>
        allFields.filter(
            ({ name }) => !isACompositeFields(name, composedFields),
        ),
);

const getRootCollectionFields = createSelector(
    getCollectionFieldsExceptComposite,
    allFields =>
        allFields
            .filter(f => f.display_in_resource || f.contribution)
            .filter(f => f.cover === COVER_COLLECTION && !f.completes),
);

const getResourceFields = createSelector(
    getParams,
    getDocumentFields,
    getRootCollectionFields,
    (resource, documentFields, collectionFields) =>
        resource
            ? [
                  ...collectionFields,
                  ...documentFields.filter(({ name }) => !!resource[name]),
              ]
            : [],
);

const getListFields = createSelector(getCollectionFields, fields =>
    fields
        .filter(f => f.display_in_list || f.name === 'uri')
        .filter(f => !f.composedOf),
);

const getGraphFields = createSelector(getDatasetFields, fields =>
    fields.filter(f => f.display_in_graph),
);

const getAllListFields = createSelector(getCollectionFields, fields =>
    fields.filter(f => !f.composedOf),
);

const findFieldWithOverviewID = id => fields => {
    const result = fields.filter(f => f.overview === id);
    return result[0] ? result[0].name : null;
};

export const getFieldByName = createSelector(
    getProps,
    getFields,
    (name, fields) => fields.find(f => f.name === name),
);

export const getGraphFieldParamsByName = createSelector(getFieldByName, field =>
    get(field, 'format.args.params', {}),
);

export const getFieldsExceptEdited = createSelector(
    getFields,
    getEditedField,
    (fields, editedField) => fields.filter(f => f._id !== editedField._id),
);

export const getFieldsExceptField = createSelector(
    getFields,
    getProps,
    (fields, field) => fields.filter(f => f._id !== field._id),
);

export const getCompletedField = createSelector(
    getProps,
    getFields,
    (field, fields) => fields.find(f => f.name === field.completes),
);

export const hasPublicationFields = ({ list }) => list.length > 0;

export const getTransformers = (state, type) => getTransformersMetas(type);

export const getTransformerArgs = (state, operation) =>
    getTransformerMetas(operation).args;

export const getFieldOntologyFormData = state =>
    state.form.ONTOLOGY_FIELD_FORM && state.form.ONTOLOGY_FIELD_FORM.values;

export const getFieldFormData = state => {
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
    (byName = {}, validationFields = []) =>
        validationFields.filter(({ isValid }) => !isValid).map(field => ({
            ...byName[field.name],
            ...field,
        })),
);

export const areAllFieldsValid = state =>
    state.allValid && (state.list || []).length > 0;

export const getLineColGetterFromAllFields = (fieldByName, field) => {
    if (!field) {
        return () => null;
    }

    return line => {
        const lineValue = line[field.name];
        return Array.isArray(lineValue) ? JSON.stringify(lineValue) : lineValue;
    };
};

export const getLineColGetter = createSelector(
    getByName,
    (_, field) => field,
    (fieldByName, field) => {
        const getLineCol = getLineColGetterFromAllFields(fieldByName, field);
        return line => {
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
    fields => fields.filter(f => !!f).map(({ label }) => label),
);

const hasPublishedDataset = ({ published }) => published;

const getContributionFields = createSelector(getFields, fields =>
    fields.filter(f => f.contribution),
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
    getParams,
    (fields, fieldName) =>
        fields.filter(f => f.completes && f.completes === fieldName),
);

const getDatasetTitleFieldName = createSelector(
    getDatasetFields,
    findFieldWithOverviewID(overview.DATASET_TITLE),
);

const getDatasetDescriptionFieldName = createSelector(
    getDatasetFields,
    findFieldWithOverviewID(overview.DATASET_DESCRIPTION),
);

const getResourceTitleFieldName = createSelector(
    getCollectionFields,
    findFieldWithOverviewID(overview.RESOURCE_TITLE),
);

const getResourceDescriptionFieldName = createSelector(
    getCollectionFields,
    findFieldWithOverviewID(overview.RESOURCE_DESCRIPTION),
);

const getResourceDetail1FieldName = createSelector(
    getAllListFields,
    findFieldWithOverviewID(overview.RESOURCE_DETAIL_1),
);

const getResourceDetail2FieldName = createSelector(
    getAllListFields,
    findFieldWithOverviewID(overview.RESOURCE_DETAIL_2),
);

const getPublishData = ({ error, published, editedFieldIndex, loading }) => ({
    published,
    editedFieldIndex,
    loading,
    error: error && (error.message || error),
});

const isLoading = state => state.loading;
const isSaving = state => state.isSaving;
const isAdding = state => state.isAdding;
const getError = state => state.error;

const getFacetFields = createSelector(getFields, allFields =>
    allFields.filter(f => f.isFacet),
);

const hasFacetFields = createSelector(
    getFacetFields,
    facetFields => facetFields.length > 0,
);

const hasSearchableFields = createSelector(
    getFields,
    allFields => allFields.filter(f => f.searchable).length > 0,
);

const canBeSearched = createSelector(
    hasFacetFields,
    hasSearchableFields,
    (hasFacet, hasSearchable) => hasFacet || hasSearchable,
);

const getNbColumns = state => state.list.length;

const getEditedValueFieldName = ({ editedValueFieldName }) =>
    editedValueFieldName;

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

export const getNewCharacteristicFormData = state =>
    state.form[NEW_CHARACTERISTIC_FORM_NAME].values;

const getFieldFormatArgs = createSelector(getFieldByName, field =>
    get(field, 'format.args', {}),
);

const getInvalidProperties = state => state.invalidProperties || [];

export default {
    areAllFieldsValid,
    getCollectionFields,
    getCompletedField,
    getEditedField,
    getFieldsForPreview,
    getFieldByName,
    getGraphFieldParamsByName,
    getFields,
    getState,
    getFieldsExceptEdited,
    getFieldsExceptField,
    getInvalidFields,
    getNbFields,
    hasPublicationFields,
    getTransformers,
    getTransformerArgs,
    getLineColGetter,
    getCompositeFieldsByField,
    getCompositeFieldsNamesByField,
    getListFields,
    getGraphFields,
    getAllListFields,
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
    getDatasetTitleFieldName,
    getDatasetDescriptionFieldName,
    getResourceTitleFieldName,
    getResourceDescriptionFieldName,
    getResourceDetail1FieldName,
    getResourceDetail2FieldName,
    getPublishData,
    isLoading,
    isSaving,
    isAdding,
    getError,
    getFacetFields,
    hasFacetFields,
    hasSearchableFields,
    getNbColumns,
    getEditedValueFieldName,
    isFieldEdited,
    isFieldConfigured,
    getFieldFormatArgs,
    getOntologyFields,
    getInvalidProperties,
    canBeSearched,
};
