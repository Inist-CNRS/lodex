import get from 'lodash/get';
import omit from 'lodash/omit';
import { createSelector } from 'reselect';

import {
    Overview,
    getTransformerMetas,
    getTransformersMetas,
    SCOPE_COLLECTION,
    SCOPE_DATASET,
    SCOPE_DOCUMENT,
    SCOPE_GRAPHIC,
    URI_FIELD_NAME,
} from '@lodex/common';
import { getProps } from '../lib/selectors';

import { splitAnnotationFormatListOptions } from './annotations';
import {
    FIELD_ANNOTATION_FORMAT_LIST,
    FIELD_ANNOTATION_FORMAT_TEXT,
} from './FieldAnnotationFormat';
import { FIELD_ANNOTATION_FORMAT_LIST_KIND_SINGLE } from './FieldAnnotationFormatListKind';

export const NEW_CHARACTERISTIC_FORM_NAME = 'NEW_CHARACTERISTIC_FORM_NAME';

// @ts-expect-error TS7031
export const getFields = ({ byName, list = [] }) =>
    list
        .map((name) => byName[name])
        .sort((f1, f2) => f1.position - f2.position);

// @ts-expect-error TS7006
const getOntologyFieldsFilter = (type, keepUriField = false) =>
    type === SCOPE_COLLECTION || type === SCOPE_DOCUMENT
        ? // @ts-expect-error TS7031
          ({ scope, name }) =>
              (name === 'uri' && keepUriField) ||
              scope === SCOPE_COLLECTION ||
              scope === SCOPE_DOCUMENT
        : // @ts-expect-error TS7031
          ({ scope, name }) =>
              (name === 'uri' && keepUriField) || scope === type;

const getOntologyFields = createSelector(
    getFields,
    // @ts-expect-error TS7006
    (_, type) => type,
    (fields, type) => fields.filter(getOntologyFieldsFilter(type)),
);

const getOntologyFieldsWithUri = createSelector(
    getFields,
    // @ts-expect-error TS7006
    (_, type) => type,
    (fields, type) => fields.filter(getOntologyFieldsFilter(type, true)),
);

// @ts-expect-error TS7006
const getState = (state) => state.list;
// @ts-expect-error TS7031
const getByName = ({ byName }) => byName;

// @ts-expect-error TS7031
const getNbFields = ({ list }) => list.length;

// @ts-expect-error TS7006
const getParams = (_, params) => params;

// @ts-expect-error TS7006
const getEditingFields = (state, { filter, subresourceId }) => {
    return (
        !subresourceId
            ? getFromFilterFields(state, filter)
            : getSubresourceFields(state, subresourceId).filter((field) => {
                  // Remove subresource field uri from editable columns
                  return !field.name.endsWith('_uri');
              })
    ).filter((field) => field.name !== URI_FIELD_NAME && field.name !== 'new');
};

export const getCollectionFields = createSelector(getFields, (fields) =>
    fields.filter(
        (f) => f.scope === SCOPE_COLLECTION || f.scope === SCOPE_DOCUMENT,
    ),
);

export const getSubresourceFields = createSelector(
    getFields,
    // @ts-expect-error TS7006
    (_, subresourceId) => subresourceId,
    (fields, subresourceId) =>
        fields.filter((f) => f.subresourceId === subresourceId),
);

const getDocumentFields = createSelector(getFields, (fields) =>
    fields.filter(
        (f) => f.display && f.contribution && f.scope === SCOPE_DOCUMENT,
    ),
);

const getDatasetFields = createSelector(getFields, (fields) =>
    fields.filter((f) => f.scope === SCOPE_DATASET),
);

const getGraphicFields = createSelector(getFields, (fields) =>
    fields.filter((f) => f.scope === SCOPE_GRAPHIC && !f.completes),
);

const getFromFilterFields = createSelector(
    getFields,
    // @ts-expect-error TS7006
    (_, type) => type,
    (fields, type) => {
        return fields
            .filter(getOntologyFieldsFilter(type, type === SCOPE_DOCUMENT))
            .filter((f) => !f.subresourceId);
    },
);

const getComposedFields = createSelector(getFields, (fields) =>
    fields.filter(({ composedOf }) => !!composedOf && composedOf.isComposedOf),
);

// @ts-expect-error TS7006
export const isACompositeFields = (name, composedFields) =>
    // @ts-expect-error TS7031
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
    (allFields) =>
        allFields
            .filter((f) => f.display)
            .filter(
                (f) =>
                    (f.scope === SCOPE_COLLECTION ||
                        f.scope === SCOPE_DOCUMENT) &&
                    !f.completes,
            ),
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

const getListFields = createSelector(getCollectionFields, (fields) =>
    fields
        .filter((f) => f.name === 'uri')
        .filter((f) => !f.composedOf || !f.composedOf?.isComposedOf),
);

const getAllListFields = createSelector(getCollectionFields, (fields) =>
    fields.filter((f) => !f.composedOf || !f.composedOf?.isComposedOf),
);

// @ts-expect-error TS7006
const findFieldWithOverviewID = (id) => (fields) => {
    // @ts-expect-error TS7006
    const result = fields.find((f) => f.overview === id);
    return result ? result.name : null;
};

export const getFieldByName = createSelector(
    getProps,
    getFields,
    (name, fields) => fields.find((f) => f.name === name),
);

export const getGraphFieldParamsByName = createSelector(
    getFieldByName,
    (field) => get(field, 'format.args.params', {}),
);

export const getFieldsExceptField = createSelector(
    getFields,
    getProps,
    (fields, field) => fields.filter((f) => f._id !== field._id),
);

export const getCompletedField = createSelector(
    getProps,
    getFields,
    (field, fields) => fields.find((f) => f.name === field.completes),
);

// @ts-expect-error TS7031
export const hasPublicationFields = ({ list }) => list.length > 0;

// @ts-expect-error TS7006
export const getTransformers = (state, type) => getTransformersMetas(type);

// @ts-expect-error TS7006
export const getTransformerArgs = (state, operation) =>
    getTransformerMetas(operation).args;

// @ts-expect-error TS7006
export const getFieldOntologyFormData = (state) =>
    state.form.ONTOLOGY_FIELD_FORM && state.form.ONTOLOGY_FIELD_FORM.values;

// @ts-expect-error TS7006
export const getFieldFormData = (state) => {
    try {
        const values = state.form.field.values;
        return {
            ...values,
            annotationFormat: values.annotable
                ? values.annotationFormat
                : FIELD_ANNOTATION_FORMAT_TEXT,
            annotationFormatListOptions:
                values.annotable &&
                values.annotationFormat === FIELD_ANNOTATION_FORMAT_LIST
                    ? splitAnnotationFormatListOptions(
                          values.annotationFormatListOptions,
                      )
                    : [],
            annotationFormatListKind:
                values.annotable &&
                values.annotationFormat === FIELD_ANNOTATION_FORMAT_LIST
                    ? values.annotationFormatListKind ??
                      FIELD_ANNOTATION_FORMAT_LIST_KIND_SINGLE
                    : FIELD_ANNOTATION_FORMAT_LIST_KIND_SINGLE,
            annotationFormatListSupportsNewValues:
                values.annotable &&
                values.annotationFormat === FIELD_ANNOTATION_FORMAT_LIST
                    ? values.annotationFormatListSupportsNewValues ?? true
                    : false,
        };
    } catch (error) {
        return undefined;
    }
};

// @ts-expect-error TS7006
const getValidationFields = (state) => state.invalidFields;

export const getInvalidFields = createSelector(
    getByName,
    getValidationFields,
    (byName = {}, validationFields = []) =>
        validationFields
            // @ts-expect-error TS7031
            .filter(({ isValid }) => !isValid)
            // @ts-expect-error TS7006
            .map((field) => ({
                ...byName[field.name],
                ...field,
            })),
);

// @ts-expect-error TS7006
export const areAllFieldsValid = (state) => {
    return state.allValid && (state.list || []).length > 0;
};

// @ts-expect-error TS7006
export const getLineColGetterFromAllFields = (fieldByName, field) => {
    if (!field) {
        return () => null;
    }

    // @ts-expect-error TS7006
    return (line) => {
        const lineValue = line[field.name];
        return Array.isArray(lineValue) ? JSON.stringify(lineValue) : lineValue;
    };
};

export const getLineColGetter = createSelector(
    getByName,
    // @ts-expect-error TS7006
    (_, field) => field,
    (fieldByName, field) => {
        const getLineCol = getLineColGetterFromAllFields(fieldByName, field);
        // @ts-expect-error TS7006
        return (line) => {
            try {
                return getLineCol(line);
            } catch (error) {
                // @ts-expect-error TS18046
                if (error.message === 'circular dependencies') {
                    return 'circular dependencies';
                }
                throw error;
            }
        };
    },
);

// @ts-expect-error TS7006
const getFieldsCatalog = (state) => state.byName;

const getCompositeFieldsByField = createSelector(
    getFieldsCatalog,
    // @ts-expect-error TS7006
    (_, field) => field,
    (fieldsCatalog, field) => {
        if (!field.composedOf || !field.composedOf?.isComposedOf) {
            return [];
        }
        const { fields } = field.composedOf;

        // @ts-expect-error TS7006
        return fields.map((name) => fieldsCatalog[name]);
    },
);

const getCompositeFieldsNamesByField = createSelector(
    getCompositeFieldsByField,
    // @ts-expect-error TS7006
    (fields) => fields.filter((f) => !!f).map(({ label }) => label),
);

// @ts-expect-error TS7031
const hasPublishedDataset = ({ published }) => published;

const getContributionFields = createSelector(getFields, (fields) =>
    fields.filter((f) => f.contribution),
);

// @ts-expect-error TS7031
const getSelectedField = ({ selectedField }) => selectedField;

// @ts-expect-error TS7031
const getFieldToAdd = ({ byName, selectedField }) => {
    if (selectedField === 'new') {
        return { scope: SCOPE_DOCUMENT };
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
        fields.filter((f) => f.completes && f.completes === fieldName),
);

const getDatasetTitleFieldName = createSelector(
    getDatasetFields,
    findFieldWithOverviewID(Overview.DATASET_TITLE),
);

const getDatasetDescriptionFieldName = createSelector(
    getDatasetFields,
    findFieldWithOverviewID(Overview.DATASET_DESCRIPTION),
);

const getResourceTitleFieldName = createSelector(
    getCollectionFields,
    findFieldWithOverviewID(Overview.RESOURCE_TITLE),
);

const getSubresourceTitleFieldName = createSelector(
    getCollectionFields,
    findFieldWithOverviewID(Overview.SUBRESOURCE_TITLE),
);

const getResourceDescriptionFieldName = createSelector(
    getCollectionFields,
    findFieldWithOverviewID(Overview.RESOURCE_DESCRIPTION),
);

const getResourceDetail1FieldName = createSelector(
    getAllListFields,
    findFieldWithOverviewID(Overview.RESOURCE_DETAIL_1),
);

const getResourceDetail2FieldName = createSelector(
    getAllListFields,
    findFieldWithOverviewID(Overview.RESOURCE_DETAIL_2),
);

const getResourceDetail3FieldName = createSelector(
    getAllListFields,
    findFieldWithOverviewID(Overview.RESOURCE_DETAIL_3),
);

const getResourceSortFieldName = createSelector(getAllListFields, (fields) => {
    return fields.find((f) => f.isDefaultSortField)?.name ?? null;
});

const getResourceSortDir = createSelector(getAllListFields, (fields) => {
    return (
        fields.find((f) => f.isDefaultSortField)?.sortOrder?.toUpperCase() ??
        'ASC'
    );
});

// @ts-expect-error TS7031
const getPublishData = ({ error, published, editedFieldIndex, loading }) => ({
    published,
    editedFieldIndex,
    loading,
    error: error && (error.message || error),
});

// @ts-expect-error TS7006
const isLoading = (state) => state.loading;
// @ts-expect-error TS7006
const isSaving = (state) => state.isSaving;
// @ts-expect-error TS7006
const isAdding = (state) => state.isAdding;
// @ts-expect-error TS7006
const getError = (state) => state.error;

const getFacetFields = createSelector(getFields, (allFields) =>
    allFields.filter((f) => f.isFacet),
);

const hasFacetFields = createSelector(
    getFacetFields,
    (facetFields) => facetFields.length > 0,
);

const hasSearchableFields = createSelector(
    getFields,
    (allFields) => allFields.filter((f) => f.searchable).length > 0,
);

const canBeSearched = createSelector(
    hasFacetFields,
    hasSearchableFields,
    (hasFacet, hasSearchable) => hasFacet || hasSearchable,
);

// @ts-expect-error TS7006
const getNbColumns = (state) => state.list.length;

// @ts-expect-error TS7031
const getEditedValueFieldName = ({ editedValueFieldName }) =>
    editedValueFieldName;

const isFieldEdited = createSelector(
    getEditedValueFieldName,
    getParams,
    (editedValueFieldName, fieldName) => editedValueFieldName === fieldName,
);

// @ts-expect-error TS7031
const getConfiguredFieldName = ({ configuredFieldName }) => configuredFieldName;

const isFieldConfigured = createSelector(
    getConfiguredFieldName,
    // @ts-expect-error TS7006
    (_, fieldName) => fieldName,
    (configuredFieldName, fieldName) => configuredFieldName === fieldName,
);

// @ts-expect-error TS7006
export const getNewCharacteristicFormData = (state) =>
    state.form[NEW_CHARACTERISTIC_FORM_NAME].values;

const getFieldFormatArgs = createSelector(getFieldByName, (field) =>
    get(field, 'format.args', {}),
);

// @ts-expect-error TS7006
const getInvalidProperties = (state) => state.invalidProperties || [];

export const getFromName = createSelector(
    getByName,
    // @ts-expect-error TS7006
    (_, name) => name,
    (fields, name) => fields[name] || null,
);

// @ts-expect-error TS7006
function isRemoveFieldListPending(state) {
    return state.isRemoveFieldListPending;
}

export default {
    getFromName,
    areAllFieldsValid,
    getCollectionFields,
    getCompletedField,
    getFieldByName,
    getGraphFieldParamsByName,
    getFields,
    getState,
    getFieldsExceptField,
    getInvalidFields,
    getNbFields,
    hasPublicationFields,
    getTransformers,
    getFromFilterFields,
    getTransformerArgs,
    getLineColGetter,
    getCompositeFieldsByField,
    getCompositeFieldsNamesByField,
    getListFields,
    getGraphicFields,
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
    getSubresourceTitleFieldName,
    getResourceDescriptionFieldName,
    getResourceDetail1FieldName,
    getResourceDetail2FieldName,
    getResourceDetail3FieldName,
    getResourceSortFieldName,
    getResourceSortDir,
    getPublishData,
    isLoading,
    isSaving,
    isAdding,
    getError,
    getSubresourceFields,
    getFacetFields,
    hasFacetFields,
    hasSearchableFields,
    getNbColumns,
    getEditedValueFieldName,
    isFieldEdited,
    isFieldConfigured,
    getFieldFormatArgs,
    getOntologyFields,
    getOntologyFieldsWithUri,
    getInvalidProperties,
    canBeSearched,
    getEditingFields,
    isRemoveFieldListPending,
};
