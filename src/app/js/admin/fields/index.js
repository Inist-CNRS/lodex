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
export const UPDATE_FIELD = 'UPDATE_FIELD';
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
export const updateField = createAction(UPDATE_FIELD);
export const updateFieldError = createAction(UPDATE_FIELD_ERROR);
export const updateFieldSuccess = createAction(UPDATE_FIELD_SUCCESS);

export const defaultState = {
    list: [],
    editedFieldIndex: null,
};

const updateFieldByProperty = (state, property, newField) => {
    const index = state.list.findIndex(field => field[property] === newField[property]);

    return {
        ...state,
        list: [
            ...state.list.slice(0, index),
            newField,
            ...state.list.slice(index + 1),
        ],
    };
};

export default handleActions({
    ADD_FIELD: state => ({
        ...state,
        editedFieldIndex: state.list.length,
        list: state.list.concat({
            name: `newField${state.list.length + 1}`,
            label: `newField ${state.list.length + 1}`,
            transformers: [],
        }),
    }),
    ADD_FIELD_SUCCESS: (state, { payload }) => updateFieldByProperty(state, 'name', payload),
    LOAD_FIELD_SUCCESS: (state, { payload }) => ({
        ...state,
        list: payload,
    }),
    LOAD_FIELD_ERROR: () => defaultState,
    EDIT_FIELD: (state, { payload }) => ({
        ...state,
        editedFieldIndex: payload,
    }),
    REMOVE_FIELD: (state, { payload: { _id: idToRemove } }) => {
        const index = state.list.findIndex(({ _id: fieldId }) => fieldId === idToRemove);

        return {
            ...state,
            list: [
                ...state.list.slice(0, index),
                ...state.list.slice(index + 1),
            ],
        };
    },
    UPDATE_FIELD: (state, { payload }) => ({
        ...state,
        list: [
            ...state.list.slice(0, state.editedFieldIndex),
            payload,
            ...state.list.slice(state.editedFieldIndex + 1),
        ],
    }),
    UPDATE_FIELD_SUCCESS: (state, { payload }) => updateFieldByProperty(state, '_id', payload),
}, defaultState);

export const getLoadFieldRequest = state => ({
    credentials: 'include',
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${state.user.token}`,
        'Content-Type': 'application/json',
    },
    url: '/api/field',
});

export const getCreateFieldRequest = (state, fieldData) => ({
    body: JSON.stringify(fieldData),
    credentials: 'include',
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${state.user.token}`,
        'Content-Type': 'application/json',
    },
    method: 'POST',
    url: '/api/field',
});

export const getRemoveFieldRequest = (state, { _id }) => ({
    credentials: 'include',
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${state.user.token}`,
        'Content-Type': 'application/json',
    },
    method: 'DELETE',
    url: `/api/field/${_id}`,
});

export const getUpdateFieldRequest = (state, { _id, ...fieldData }) => ({
    body: JSON.stringify(fieldData),
    credentials: 'include',
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${state.user.token}`,
        'Content-Type': 'application/json',
    },
    method: 'PUT',
    url: `/api/field/${_id}`,
});

export const getFields = state => state.fields.list;

export const getLastField = state => state.fields.list[state.fields.list.length - 1];

export const getEditedField = state => state.fields.list[state.fields.editedFieldIndex];

export const getPublicationFields = state => state.fields.list;

export const hasPublicationFields = state => state.fields.length > 0;

export const getTransformers = () => getTransformersMetas();

export const getTransformerArgs = (state, operation) => getTransformerMetas(operation);

export const getFieldFormData = state => state.form.field.values;

export const getSchemeSearchRequest = (state, query) => ({
    url: `http://lov.okfn.org/dataset/lov/api/v2/vocabulary/autocomplete?q=${query}`,
});

export const getSchemeMenuItemsDataFromResponse = (state, response) => (
    response && response.results
        ? response.results.map(r => ({ label: r['http://purl.org/dc/terms/title@en'][0], uri: r.uri[0] }))
        : []
);
