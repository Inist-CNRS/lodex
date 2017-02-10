import { createAction, handleActions } from 'redux-actions';

export const LOAD_RESOURCE = 'LOAD_RESOURCE';
export const LOAD_RESOURCE_SUCCESS = 'LOAD_RESOURCE_SUCCESS';
export const LOAD_RESOURCE_ERROR = 'LOAD_RESOURCE_ERROR';

export const SAVE_RESOURCE = 'SAVE_RESOURCE';
export const SAVE_RESOURCE_SUCCESS = 'SAVE_RESOURCE_SUCCESS';
export const SAVE_RESOURCE_ERROR = 'SAVE_RESOURCE_ERROR';

export const HIDE_RESOURCE = 'HIDE_RESOURCE';
export const HIDE_RESOURCE_SUCCESS = 'HIDE_RESOURCE_SUCCESS';
export const HIDE_RESOURCE_ERROR = 'HIDE_RESOURCE_ERROR';

export const ADD_FIELD_TO_RESOURCE = 'ADD_FIELD_TO_RESOURCE';
export const ADD_FIELD_TO_RESOURCE_SUCCESS = 'ADD_FIELD_TO_RESOURCE_SUCCESS';
export const ADD_FIELD_TO_RESOURCE_ERROR = 'ADD_FIELD_TO_RESOURCE_ERROR';

export const RESOURCE_FORM_NAME = 'resource';
export const HIDE_RESOURCE_FORM_NAME = 'hideResource';
export const NEW_RESOURCE_FIELD_FORM_NAME = 'newResourceField';

export const loadResource = createAction(LOAD_RESOURCE);
export const loadResourceSuccess = createAction(LOAD_RESOURCE_SUCCESS);
export const loadResourceError = createAction(LOAD_RESOURCE_ERROR);

export const saveResource = createAction(SAVE_RESOURCE);
export const saveResourceSuccess = createAction(SAVE_RESOURCE_SUCCESS);
export const saveResourceError = createAction(SAVE_RESOURCE_ERROR);

export const hideResource = createAction(HIDE_RESOURCE);
export const hideResourceSuccess = createAction(HIDE_RESOURCE_SUCCESS);
export const hideResourceError = createAction(HIDE_RESOURCE_ERROR);

export const addFieldToResource = createAction(ADD_FIELD_TO_RESOURCE);
export const addFieldToResourceSuccess = createAction(ADD_FIELD_TO_RESOURCE_SUCCESS);
export const addFieldToResourceError = createAction(ADD_FIELD_TO_RESOURCE_ERROR);

export const defaultState = {
    resource: {},
    error: null,
    loading: false,
    saving: false,
};

export default handleActions({
    LOAD_RESOURCE: state => ({
        ...state,
        error: null,
        loading: true,
        saving: false,
    }),
    LOAD_RESOURCE_SUCCESS: (state, { payload }) => ({
        ...state,
        resource: payload,
        error: null,
        loading: false,
        saving: false,
    }),
    LOAD_RESOURCE_ERROR: (state, { payload: error }) => ({
        ...state,
        error: error.message,
        loading: false,
        saving: false,
    }),
    SAVE_RESOURCE: state => ({
        ...state,
        error: null,
        saving: true,
    }),
    SAVE_RESOURCE_SUCCESS: state => ({
        ...state,
        error: null,
        saving: false,
    }),
    SAVE_RESOURCE_ERROR: (state, { payload: error }) => ({
        ...state,
        error: error.message,
        saving: false,
    }),
    HIDE_RESOURCE: state => ({
        ...state,
        error: null,
        saving: true,
    }),
    HIDE_RESOURCE_SUCCESS: state => ({
        ...state,
        error: null,
        saving: false,
    }),
    HIDE_RESOURCE_ERROR: (state, { payload: error }) => ({
        ...state,
        error: error.message,
        saving: false,
    }),
    ADD_FIELD_TO_RESOURCE: state => ({
        ...state,
        error: null,
        saving: true,
    }),
    ADD_FIELD_TO_RESOURCE_SUCCESS: state => ({
        ...state,
        error: null,
        saving: false,
    }),
    ADD_FIELD_TO_RESOURCE_ERROR: (state, { payload: error }) => ({
        ...state,
        error: error.message,
        saving: false,
    }),
}, defaultState);

export const getLoadResourceRequest = (state, uri) => ({
    url: `/api/ark?uri=${uri}`,
    credentials: 'include',
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${state.user.token}`,
        'Content-Type': 'application/json',
    },
});

export const getSaveResourceRequest = (state, resource) => ({
    url: '/api/publishedDataset',
    credentials: 'include',
    method: 'POST',
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${state.user.token}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(resource),
});

export const getHideResourceRequest = (state, data) => ({
    url: '/api/publishedDataset',
    credentials: 'include',
    method: 'DELETE',
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${state.user.token}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
});

export const getAddFieldToResourceRequest = (state, data) => ({
    url: '/api/publishedDataset/add_field',
    credentials: 'include',
    method: 'POST',
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${state.user.token}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
});

export const getResourceLastVersion = (state) => {
    const resource = state.resource.resource;
    const { versions, uri } = resource;
    if (!versions) {
        return null;
    }
    return {
        ...versions[versions.length - 1],
        uri,
    };
};

export const getResourceUnvalidatedFields = (state) => {
    const { contributions } = state.resource.resource;
    if (!contributions) {
        return [];
    }
    return contributions
        .filter(({ validated }) => !validated)
        .map(({ fieldName }) => fieldName);
};

export const getResourceContributorsByField = (state) => {
    const { contributions } = state.resource.resource;
    if (!contributions) {
        return [];
    }
    return contributions
        .reduce((acc, { fieldName, contributor: { name } }) => ({
            ...acc,
            [fieldName]: name,
        }), {});
};

export const getRemovedData = (state) => {
    const resource = state.resource.resource;
    const { uri, removedAt, reason } = resource;
    return {
        uri,
        removedAt,
        reason,
    };
};

export const getResourceFormData = state => state.form.resource.values;
export const getHideResourceFormData = state => state.form.hideResource.values;
export const getNewResourceFieldFormData = state => state.form.newResourceField.values;
export const isLoading = state => state.resource.loading;
export const isSaving = state => state.resource.saving;
