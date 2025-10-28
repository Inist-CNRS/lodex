import { createAction, handleActions } from 'redux-actions';

export const LOAD_PUBLICATION = 'LOAD_PUBLICATION';
export const LOAD_PUBLICATION_SUCCESS = 'LOAD_PUBLICATION_SUCCESS';
export const LOAD_PUBLICATION_ERROR = 'LOAD_PUBLICATION_ERROR';
export const COMPUTE_PUBLICATION = 'COMPUTE_PUBLICATION';
export const PUBLICATION_CLEARED = 'PUBLICATION_CLEARED';
export const SELECT_FIELD = 'SELECT_FIELD';

export const loadPublication = createAction(LOAD_PUBLICATION);
export const loadPublicationSuccess = createAction(LOAD_PUBLICATION_SUCCESS);
export const loadPublicationError = createAction(LOAD_PUBLICATION_ERROR);
export const computePublication = createAction(COMPUTE_PUBLICATION);
export const publicationCleared = createAction(PUBLICATION_CLEARED);

export const selectField = createAction(SELECT_FIELD);

export const defaultState = {
    initialized: false,
    loading: false,
    fields: [],
    published: false,
};

export default handleActions(
    {
        LOAD_PUBLICATION: (state) => ({
            ...state,
            initialized: true,
            error: null,
            loading: true,
        }),
        LOAD_PUBLICATION_SUCCESS: (
            state,
            { payload: { fields, published } },
        ) => ({
            ...state,
            error: null,
            loading: false,
            fields,
            published,
        }),
        LOAD_PUBLICATION_ERROR: (state, { payload: error }) => ({
            ...state,
            // @ts-expect-error TS7031
            error: error.message,
            loading: false,
        }),
        SELECT_FIELD: (state, { payload: name }) => ({
            ...state,
            selectedField: name,
        }),
        PUBLICATION_CLEARED: (state) => ({
            ...state,
            published: false,
        }),
    },
    defaultState,
);

// @ts-expect-error TS7031
export const hasPublishedDataset = ({ published }) => published;
// @ts-expect-error TS7031
export const isPublicationLoading = ({ loading }) => loading;
// @ts-expect-error TS7031
export const isInitialized = ({ initialized }) => initialized;

export const selectors = {
    hasPublishedDataset,
    isPublicationLoading,
    isInitialized,
};
