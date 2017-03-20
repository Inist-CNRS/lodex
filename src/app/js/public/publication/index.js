import omit from 'lodash.omit';
import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

import TITLE_SCHEME from '../../../../common/titleScheme';
import { COVER_COLLECTION, COVER_DATASET, COVER_DOCUMENT } from '../../../../common/cover';

export const LOAD_PUBLICATION = 'LOAD_PUBLICATION';
export const LOAD_PUBLICATION_SUCCESS = 'LOAD_PUBLICATION_SUCCESS';
export const LOAD_PUBLICATION_ERROR = 'LOAD_PUBLICATION_ERROR';

export const SELECT_FIELD = 'SELECT_FIELD';

export const loadPublication = createAction(LOAD_PUBLICATION);
export const loadPublicationSuccess = createAction(LOAD_PUBLICATION_SUCCESS);
export const loadPublicationError = createAction(LOAD_PUBLICATION_ERROR);

export const selectField = createAction(SELECT_FIELD);

export const defaultState = {
    loading: false,
    fields: [],
    published: false,
};

export default handleActions({
    LOAD_PUBLICATION: state => ({
        ...state,
        error: null,
        loading: true,
    }),
    LOAD_PUBLICATION_SUCCESS: (state, { payload: { fields, published } }) => ({
        ...state,
        error: null,
        loading: false,
        fields,
        published,
    }),
    LOAD_PUBLICATION_ERROR: (state, { payload: error }) => ({
        ...state,
        error: error.message,
        loading: false,
    }),
    SELECT_FIELD: (state, { payload: name }) => ({
        ...state,
        selectedField: name,
    }),
}, defaultState);

const hasPublishedDataset = ({ published }) => published;

const getFields = ({ fields }) => fields || [];

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

const getFieldNameFromParams = (state, params) => params;

const getFieldByName = createSelector(
    getFields,
    getFieldNameFromParams,
    (fields, name) => fields.find(f => f.name === name),
);

const getContributionFields = createSelector(
    getFields,
    fields => fields.filter(f => f.contribution),
);

const getSelectedField = ({ selectedField }) => selectedField;

const getFieldToAdd = ({ fields, selectedField }) => {
    if (selectedField === 'new') {
        return { cover: 'document' };
    }
    const field = fields.filter(({ name }) => name === selectedField)[0];
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
        const titleField = fields
            .find(({ cover, scheme }) => scheme === TITLE_SCHEME && cover === COVER_COLLECTION);

        return titleField ? titleField.name : null;
    },
);

const getDatasetTitleFieldName = createSelector(
    getCollectionFields,
    (fields) => {
        const titleField = fields
            .find(({ cover, scheme }) => scheme === TITLE_SCHEME && cover === COVER_DATASET);

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

const getFieldsCatalog = createSelector(
    getFields,
    fields => fields.reduce((catalog, field) => ({
        ...catalog,
        [field.name]: field,
    }), {}),
);

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
    getPublicationError,
    getCompositeFieldsByField,
    getFacetFields,
    hasFacetFields,
    hasSearchableFields,
    getNbColumns,
};
