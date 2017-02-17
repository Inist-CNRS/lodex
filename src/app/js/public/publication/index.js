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
    published: null,
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


export const hasPublishedDataset = ({ publication: { published } }) => published;

export const getFields = ({ publication: { fields } }) => fields || [];

export const getCollectionFields = createSelector(
    getFields,
    fields => fields.filter(f => f.cover === COVER_COLLECTION),
);

const getFieldNameFromParams = (state, params) => params;

export const getFieldByName = createSelector(
    getFields,
    getFieldNameFromParams,
    (fields, name) => fields.find(f => f.name === name),
);

export const getContributionFields = createSelector(
    getFields,
    fields => fields.filter(f => f.contribution),
);

export const getSelectedField = ({ publication: { selectedField } }) => selectedField;

export const getFieldToAdd = ({ publication: { fields, selectedField } }) => {
    if (selectedField === 'new') {
        return { cover: 'document' };
    }
    const field = fields.filter(({ name }) => name === selectedField)[0];
    if (!field) {
        return null;
    }
    return omit(field, ['contributors', '_id']);
};

export const getDocumentFields = createSelector(
    getFields,
    fields => fields.filter(f => f.cover === COVER_DOCUMENT),
);

export const getDatasetFields = createSelector(
    getFields,
    fields => fields.filter(f => f.cover === COVER_DATASET),
);

export const getTitleFieldName = createSelector(
    getCollectionFields,
    (fields) => {
        const titleField = fields
            .find(({ cover, scheme }) => scheme === TITLE_SCHEME && cover === COVER_COLLECTION);

        return titleField ? titleField.name : null;
    },
);

const getPublication = ({ publication }) => publication;

export const getPublishData = createSelector(
    getPublication,
    ({ error, published, editedFieldIndex, loading }) => ({
        published,
        editedFieldIndex,
        loading,
        error: error && (error.message || error),
    }),
);

export const isPublicationLoading = state => state.publication.loading;
export const getPublicationError = state => state.publication.error;

export const fromPublication = {
    getPublishData,
};
