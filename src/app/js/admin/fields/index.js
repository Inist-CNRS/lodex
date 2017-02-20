import omit from 'lodash.omit';
import { createAction, handleActions } from 'redux-actions';

import { getTransformersMetas, getTransformerMetas } from '../../../../common/transformers';

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
export const updateFieldError = createAction(UPDATE_FIELD_ERROR);
export const updateFieldSuccess = createAction(UPDATE_FIELD_SUCCESS);

export const defaultState = {
    byId: {},
    list: [],
    editedFieldId: null,
};

export default handleActions({
    ADD_FIELD_SUCCESS: (state, { payload }) => ({
        ...state,
        editedFieldId: payload._id,
        list: [...state.list, payload._id],
        byId: {
            ...state.byId,
            [payload._id]: payload,
        },
    }),
    LOAD_FIELD_SUCCESS: (state, { payload }) => ({
        ...state,
        list: payload.map(({ _id }) => _id),
        byId: payload.reduce((acc, field) => ({
            ...acc,
            [field._id]: field,
        }), {}),
    }),
    LOAD_FIELD_ERROR: () => defaultState,
    EDIT_FIELD: (state, { payload }) => ({
        ...state,
        editedFieldId: state.list[payload],
    }),
    REMOVE_FIELD: (state, { payload: { _id: idToRemove } }) => ({
        ...state,
        list: state.list.filter(id => id !== idToRemove),
        byId: omit(state.byId, [idToRemove]),
    }),
    UPDATE_FIELD_SUCCESS: (state, { payload }) => ({
        ...state,
        byId: {
            ...state.byId,
            [payload._id]: payload,
        },
    }),
}, defaultState);

const getFields = ({ byId, list }) => list.map(id => byId[id]);

const getNbFields = ({ list }) => list.length;

const getEditedField = state => state.byId[state.editedFieldId];

export const getTransformers = () => getTransformersMetas();

export const getTransformerArgs = (state, operation) => getTransformerMetas(operation);

export const getFieldFormData = state => state.form.field.values;

export const getSchemeSearchRequest = (state, query) => ({
    url: `http://lov.okfn.org/dataset/lov/api/v2/term/autocomplete?q=${query}`,
});

export const getSchemeMenuItemsDataFromResponse = (state, response) => (
    response && response.results
        ? response.results.map(r => ({ label: r.localName[0], uri: r.uri[0] }))
        : []
);

export const fromFields = {
    getFields,
    getNbFields,
    getEditedField,
};
