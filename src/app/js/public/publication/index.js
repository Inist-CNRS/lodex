import omit from 'lodash.omit';
import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

import TITLE_SCHEME from '../../../../common/titleScheme';
import { COVER_COLLECTION, COVER_DATASET, COVER_DOCUMENT } from '../../../../common/cover';
import getCatalogFromArray from '../../lib/getCatalogFromArray';

export const LOAD_PUBLICATION = 'LOAD_PUBLICATION';
export const LOAD_PUBLICATION_SUCCESS = 'LOAD_PUBLICATION_SUCCESS';
export const LOAD_PUBLICATION_ERROR = 'LOAD_PUBLICATION_ERROR';

export const SELECT_FIELD = 'SELECT_FIELD';

export const SAVE_FIELD = 'SAVE_FIELD';
export const SAVE_FIELD_SUCCESS = 'SAVE_FIELD_SUCCESS';
export const SAVE_FIELD_ERROR = 'SAVE_FIELD_ERROR';

export const loadPublication = createAction(LOAD_PUBLICATION);
export const loadPublicationSuccess = createAction(LOAD_PUBLICATION_SUCCESS);
export const loadPublicationError = createAction(LOAD_PUBLICATION_ERROR);

export const selectField = createAction(SELECT_FIELD);

export const saveField = createAction(SAVE_FIELD);
export const saveFieldSuccess = createAction(SAVE_FIELD_SUCCESS);
export const saveFieldError = createAction(SAVE_FIELD_ERROR);

export const defaultState = {
    loading: false,
    isSaving: false,
    fields: [],
    byName: {},
    published: false,
};

export default handleActions({
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
            fields: list,
            published,
        };
    },
    LOAD_PUBLICATION_ERROR: (state, { payload: error }) => ({
        ...state,
        error: error.message,
        loading: false,
    }),
    SELECT_FIELD: (state, { payload: name }) => ({
        ...state,
        selectedField: name,
    }),
    SAVE_FIELD: state => ({
        ...state,
        error: null,
        isSaving: true,
    }),
    SAVE_FIELD_SUCCESS: (state, { payload: field }) => ({
        ...state,
        isSaving: false,
        error: null,
        byName: {
            ...state.byName,
            [field.name]: field,
        },
    }),
    SAVE_FIELD_ERROR: (state, { payload: error }) => ({
        ...state,
        isSaving: false,
        error: error.message,
    }),
}, defaultState);

const hasPublishedDataset = ({ published }) => published;

const getFields = ({ fields = [], byName }) =>
    fields.map(name => byName[name]);

const getCollectionFields = createSelector(
    getFields,
    fields => fields.filter(f => f.cover === COVER_COLLECTION),
);

const getListFields = createSelector(
    getCollectionFields,
    fields => fields
        .filter(f => f.display_in_list || f.name === 'uri')
        .filter(f => !f.composedOf),
);

const getFieldByName = (state, name) => state.byName[name];

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

const getDocumentFields = createSelector(
    getFields,
    fields => fields
        .filter(f => f.display_in_resource || f.contribution)
        .filter(f => f.cover === COVER_DOCUMENT),
);

const getParams = (state, params) => params;

const getLinkedFields = createSelector(
    getFields,
    (getParams),
    (fields, fieldName) => fields.filter(f => f.completes && f.completes === fieldName),
);

const getCompletedField = createSelector(
    getFields,
    getParams,
    (fields, field) => fields.find(f => field.completes === f.name),
);

const getDatasetFields = createSelector(
    getFields,
    fields => fields.filter(f => f.cover === COVER_DATASET),
);

const getTitleFieldName = createSelector(
    getCollectionFields,
    (fields) => {
        let titleField = fields
            .find(({ cover, scheme }) => scheme === TITLE_SCHEME && cover === COVER_COLLECTION);

        if (!titleField) {
            titleField = fields
                .find(({ label }) => label.match(/^title$/));
        }

        return titleField ? titleField.name : null;
    },
);

const getDatasetTitleFieldName = createSelector(
    getDatasetFields,
    (fields) => {
        let titleField = fields
            .find(({ cover, scheme }) => scheme === TITLE_SCHEME && cover === COVER_DATASET);

        if (!titleField) {
            titleField = fields
                .find(({ label }) => label.match(/^title$/));
        }

        return titleField ? titleField.name : null;
    },
);

const getPublishData = ({ error, published, editedFieldIndex, loading }) => ({
    published,
    editedFieldIndex,
    loading,
    error: error && (error.message || error),
});

const isPublicationLoading = state => state.loading;
const isPublicationSaving = state => state.isSaving;
const getPublicationError = state => state.error;

const getComposedFields = createSelector(
    getFields,
    fields => fields.filter(({ composedOf }) => !!composedOf),
);

export const isACompositeFields = (name, composedFields) =>
    composedFields.some(({ composedOf: { fields } }) => fields.includes(name));

const getCollectionFieldsExceptComposite = createSelector(
    getFields,
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

const getNbColumns = state => state.fields.length;

export const getFieldFormData = state => state.form.ONTOLOGY_FIELD_FORM && state.form.ONTOLOGY_FIELD_FORM.values;

export const fromPublication = {
    getFields,
    getCollectionFields,
    getListFields,
    getCollectionFieldsExceptComposite,
    getRootCollectionFields,
    getResourceFields,
    hasPublishedDataset,
    getFieldByName,
    getContributionFields,
    getSelectedField,
    getFieldToAdd,
    getDocumentFields,
    getLinkedFields,
    getCompletedField,
    getDatasetFields,
    getTitleFieldName,
    getDatasetTitleFieldName,
    getPublishData,
    isPublicationLoading,
    isPublicationSaving,
    getPublicationError,
    getCompositeFieldsByField,
    getFacetFields,
    hasFacetFields,
    hasSearchableFields,
    getNbColumns,
};
