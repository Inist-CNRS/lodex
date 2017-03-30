import { createAction, handleActions } from 'redux-actions';

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


export const hasPublishedDataset = ({ published }) => published;
export const hasLoadedDataset = ({ fields }) => !!fields.length;

export const selectors = {
    hasPublishedDataset,
    hasLoadedDataset,
};
