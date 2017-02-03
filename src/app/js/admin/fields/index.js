import { createAction, handleActions } from 'redux-actions';
import { getTransformersMetas, getTransformerMetas } from '../../../../common/transformers';

export const FIELD_FORM_NAME = 'field';

export const LOAD_FIELD = 'LOAD_FIELD';
export const LOAD_FIELD_SUCCESS = 'LOAD_FIELD_SUCCESS';
export const LOAD_FIELD_ERROR = 'LOAD_FIELD_ERROR';
export const SAVE_FIELD = 'SAVE_FIELD';
export const ADD_FIELD = 'ADD_FIELD';
export const EDIT_FIELD = 'EDIT_FIELD';

export const loadField = createAction(LOAD_FIELD);
export const loadFieldSuccess = createAction(LOAD_FIELD_SUCCESS);
export const loadFieldError = createAction(LOAD_FIELD_ERROR);
export const saveField = createAction(SAVE_FIELD);
export const addField = createAction(ADD_FIELD);
export const editField = createAction(EDIT_FIELD);

export const defaultState = {
    list: [],
    editedFieldIndex: null,
};

export default handleActions({
    LOAD_FIELD_SUCCESS: (state, { payload }) => ({
        ...state,
        list: payload,
    }),
    LOAD_FIELD_ERROR: () => defaultState,
    ADD_FIELD: state => ({
        ...state,
        editedFieldIndex: state.list.length,
        list: state.list.concat({
            name: `newField${state.list.length + 1}`,
            label: `newField ${state.list.length + 1}`,
            transformers: [],
        }),
    }),
    SAVE_FIELD: (state, { payload }) => ({
        ...state,
        list: [
            ...state.list.slice(0, state.editedFieldIndex),
            payload,
            ...state.list.slice(state.editedFieldIndex + 1),
        ],
    }),
    EDIT_FIELD: (state, { payload }) => ({
        ...state,
        editedFieldIndex: payload,
    }),
}, defaultState);

export const getLoadFieldRequest = state => ({
    url: '/api/field',
    credentials: 'include',
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${state.user.token}`,
        'Content-Type': 'application/json',
    },
});

export const getFields = state => state.fields.list;

export const getEditedField =
    state => state.fields.list[state.fields.editedFieldIndex];

export const getPublicationFields = state => state.fields.list;

export const hasPublicationFields = state => state.fields.length > 0;

export const getTransformers = () => getTransformersMetas();

export const getTransformerArgs = (state, operation) => getTransformerMetas(operation);

export const getFieldFormData = state => state.form.field.values;
