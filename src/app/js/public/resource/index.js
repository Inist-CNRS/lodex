import { createAction, handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';

import { PROPOSED } from '../../../../common/propositionStatus';

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

export const CHANGE_FIELD_STATUS = 'CHANGE_FIELD_STATUS';

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

export const changeFieldStatus = createAction(CHANGE_FIELD_STATUS);

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
    [combineActions(
        SAVE_RESOURCE,
        HIDE_RESOURCE,
        ADD_FIELD_TO_RESOURCE,
    )]: state => ({
        ...state,
        error: null,
        saving: true,
    }),
    [combineActions(
        SAVE_RESOURCE_SUCCESS,
        HIDE_RESOURCE_SUCCESS,
        ADD_FIELD_TO_RESOURCE_SUCCESS,
    )]: state => ({
        ...state,
        error: null,
        saving: false,
    }),
    [combineActions(
        SAVE_RESOURCE_ERROR,
        HIDE_RESOURCE_ERROR,
        ADD_FIELD_TO_RESOURCE_ERROR)
    ]: (state, { payload: error }) => ({
        ...state,
        error: error.message,
        saving: false,
    }),
    CHANGE_FIELD_STATUS: (state, { payload: { field, status } }) => {
        const { contributions } = state.resource;
        const index = contributions.findIndex(({ fieldName }) => fieldName === field);

        return {
            ...state,
            resource: {
                ...state.resource,
                contributions: [
                    ...contributions.slice(0, index - 1),
                    {
                        ...contributions[index],
                        status,
                    },
                    ...contributions.slice(index + 1),
                ],
            },
        };
    },
}, defaultState);

const getResourceLastVersion = (state, resource = state.resource) => {
    const { versions, uri } = resource;
    if (!versions) {
        return null;
    }
    return {
        ...versions[versions.length - 1],
        uri,
    };
};

const getResourceProposedFields = (state) => {
    const { contributions } = state.resource;
    if (!contributions) {
        return [];
    }
    return contributions
        .filter(({ status }) => status === PROPOSED)
        .map(({ fieldName }) => fieldName);
};

const getProposedFieldStatus = (state) => {
    const { contributions } = state.resource;
    if (!contributions) {
        return {};
    }
    return contributions
        .reduce((acc, { fieldName, status }) => ({
            [fieldName]: status,
        }), {});
};

const getFieldStatus = createSelector(
    getProposedFieldStatus,
    (_, { name }) => name,
    (fieldStatusByName, name) => fieldStatusByName[name],
);

const getResourceContributions = state =>
    state.resource.contributions || [];

const getResourceContributorsByField =
    createSelector(
        getResourceContributions,
        contributions => contributions
            .filter(({ contributor }) => !!contributor)
            .reduce((acc, { fieldName, contributor: { name } }) => ({
                ...acc,
                [fieldName]: name,
            }), {}),
    );

const getRemovedData = (state) => {
    const resource = state.resource;
    const { uri, removedAt, reason } = resource;
    return {
        uri,
        removedAt,
        reason,
    };
};

const isSaving = state => state.saving;

const isLoading = state => state.loading;

export const fromResource = {
    getResourceLastVersion,
    getResourceProposedFields,
    getResourceContributions,
    getResourceContributorsByField,
    getRemovedData,
    isSaving,
    isLoading,
    getProposedFieldStatus,
    getFieldStatus,
};

export const getResourceFormData = state => state.form.resource.values;
export const getHideResourceFormData = state => state.form.hideResource.values;
export const getNewResourceFieldFormData = state => state.form.newResourceField && state.form.newResourceField.values;
