import { createAction, handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';

import { PROPOSED } from '../../../../common/propositionStatus';

export const PRE_LOAD_RESOURCE = 'PRE_LOAD_RESOURCE';
export const LOAD_RESOURCE = 'LOAD_RESOURCE';
export const LOAD_RESOURCE_SUCCESS = 'LOAD_RESOURCE_SUCCESS';
export const LOAD_RESOURCE_ERROR = 'LOAD_RESOURCE_ERROR';

export const SAVE_RESOURCE = 'SAVE_RESOURCE';
export const SAVE_RESOURCE_SUCCESS = 'SAVE_RESOURCE_SUCCESS';
export const SAVE_RESOURCE_ERROR = 'SAVE_RESOURCE_ERROR';

export const HIDE_RESOURCE = 'HIDE_RESOURCE';
export const HIDE_RESOURCE_OPEN = 'HIDE_RESOURCE_OPEN';
export const HIDE_RESOURCE_CANCEL = 'HIDE_RESOURCE_CANCEL';
export const HIDE_RESOURCE_SUCCESS = 'HIDE_RESOURCE_SUCCESS';
export const HIDE_RESOURCE_ERROR = 'HIDE_RESOURCE_ERROR';

export const ADD_FIELD_TO_RESOURCE = 'ADD_FIELD_TO_RESOURCE';
export const ADD_FIELD_TO_RESOURCE_OPEN = 'ADD_FIELD_TO_RESOURCE_OPEN';
export const ADD_FIELD_TO_RESOURCE_CANCEL = 'ADD_FIELD_TO_RESOURCE_CANCEL';
export const ADD_FIELD_TO_RESOURCE_SUCCESS = 'ADD_FIELD_TO_RESOURCE_SUCCESS';
export const ADD_FIELD_TO_RESOURCE_ERROR = 'ADD_FIELD_TO_RESOURCE_ERROR';

export const RESOURCE_FORM_NAME = 'resource';
export const HIDE_RESOURCE_FORM_NAME = 'hideResource';
export const NEW_RESOURCE_FIELD_FORM_NAME = 'newResourceField';
export const CREATE_RESOURCE_FORM_NAME = 'createResource';

export const CHANGE_FIELD_STATUS = 'CHANGE_FIELD_STATUS';
export const CHANGE_FIELD_STATUS_SUCCESS = 'CHANGE_FIELD_STATUS_SUCCESS';
export const CHANGE_FIELD_STATUS_ERROR = 'CHANGE_FIELD_STATUS_ERROR';
export const SELECT_VERSION = 'SELECT_VERSION';

export const CREATE_RESOURCE = 'CREATE_RESOURCE';
export const CREATE_RESOURCE_CANCEL = 'CREATE_RESOURCE_CANCEL';
export const CREATE_RESOURCE_OPEN = 'CREATE_RESOURCE_OPEN';
export const CREATE_RESOURCE_SUCCESS = 'CREATE_RESOURCE_SUCCESS';
export const CREATE_RESOURCE_ERROR = 'CREATE_RESOURCE_ERROR';

export const preLoadResource = createAction(PRE_LOAD_RESOURCE);
export const loadResource = createAction(LOAD_RESOURCE);
export const loadResourceSuccess = createAction(LOAD_RESOURCE_SUCCESS);
export const loadResourceError = createAction(LOAD_RESOURCE_ERROR);

export const saveResource = createAction(SAVE_RESOURCE);
export const saveResourceSuccess = createAction(SAVE_RESOURCE_SUCCESS);
export const saveResourceError = createAction(SAVE_RESOURCE_ERROR);

export const hideResource = createAction(HIDE_RESOURCE);
export const hideResourceOpen = createAction(HIDE_RESOURCE_OPEN);
export const hideResourceCancel = createAction(HIDE_RESOURCE_CANCEL);
export const hideResourceSuccess = createAction(HIDE_RESOURCE_SUCCESS);
export const hideResourceError = createAction(HIDE_RESOURCE_ERROR);

export const addFieldToResource = createAction(ADD_FIELD_TO_RESOURCE);
export const addFieldToResourceOpen = createAction(ADD_FIELD_TO_RESOURCE_OPEN);
export const addFieldToResourceCancel = createAction(
    ADD_FIELD_TO_RESOURCE_CANCEL,
);
export const addFieldToResourceSuccess = createAction(
    ADD_FIELD_TO_RESOURCE_SUCCESS,
);
export const addFieldToResourceError = createAction(
    ADD_FIELD_TO_RESOURCE_ERROR,
);

export const changeFieldStatus = createAction(CHANGE_FIELD_STATUS);
export const changeFieldStatusSuccess = createAction(
    CHANGE_FIELD_STATUS_SUCCESS,
);
export const changeFieldStatusError = createAction(CHANGE_FIELD_STATUS_ERROR);
export const selectVersion = createAction(SELECT_VERSION);

export const createResource = createAction(CREATE_RESOURCE);
export const createResourceOpen = createAction(CREATE_RESOURCE_OPEN);
export const createResourceCancel = createAction(CREATE_RESOURCE_CANCEL);
export const createResourceSuccess = createAction(CREATE_RESOURCE_SUCCESS);
export const createResourceError = createAction(CREATE_RESOURCE_ERROR);

export const defaultState = {
    resource: null,
    error: null,
    loading: false,
    saving: false,
    addingField: false,
    hiding: false,
    selectedVersion: 0,
};

export default handleActions(
    {
        LOAD_RESOURCE: state => ({
            ...state,
            resource: null,
            selectedVersion: 0,
            error: null,
            loading: true,
            saving: false,
        }),
        LOAD_RESOURCE_SUCCESS: (state, { payload }) => ({
            ...state,
            resource: payload,
            selectedVersion: payload.versions.length - 1,
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
        SAVE_RESOURCE_SUCCESS: (state, { payload }) => {
            const resource = payload || state.resource;
            return {
                ...state,
                resource,
                selectedVersion: resource.versions.length - 1,
                error: null,
                saving: false,
            };
        },
        [HIDE_RESOURCE_SUCCESS]: (
            { resource, ...state },
            { payload: { reason, removedAt } },
        ) => ({
            ...state,
            error: null,
            hiding: false,
            saving: false,
            resource: {
                ...resource,
                reason,
                removedAt,
            },
        }),
        [ADD_FIELD_TO_RESOURCE_SUCCESS]: (
            state,
            { payload: { resource } },
        ) => ({
            ...state,
            resource,
            selectedVersion: resource.versions.length - 1,
            error: null,
            loading: false,
            addingField: null,
            saving: false,
        }),
        [combineActions(
            SAVE_RESOURCE_ERROR,
            HIDE_RESOURCE_ERROR,
            ADD_FIELD_TO_RESOURCE_ERROR,
            CREATE_RESOURCE_ERROR,
        )]: (state, { payload: error }) => ({
            ...state,
            error: error.message,
            saving: false,
        }),
        CHANGE_FIELD_STATUS: (state, { payload: { field, status } }) => {
            const { contributions } = state.resource;
            const index = contributions.findIndex(
                ({ fieldName }) => fieldName === field,
            );

            return {
                ...state,
                moderating: true,
                resource: {
                    ...state.resource,
                    contributions: [
                        ...contributions.slice(0, index),
                        {
                            ...contributions[index],
                            status,
                        },
                        ...contributions.slice(index + 1),
                    ],
                },
            };
        },
        CHANGE_FIELD_STATUS_ERROR: (
            state,
            { payload: { error, field, prevStatus } },
        ) => {
            const { contributions } = state.resource;
            const index = contributions.findIndex(
                ({ fieldName }) => fieldName === field,
            );

            return {
                ...state,
                error,
                moderating: false,
                resource: {
                    ...state.resource,
                    contributions: [
                        ...contributions.slice(0, index),
                        {
                            ...contributions[index],
                            status: prevStatus,
                        },
                        ...contributions.slice(index + 1),
                    ],
                },
            };
        },
        CHANGE_FIELD_STATUS_SUCCESS: state => ({
            ...state,
            error: null,
            moderating: false,
        }),
        SELECT_VERSION: (state, { payload: selectedVersion }) => ({
            ...state,
            selectedVersion,
        }),
        ADD_FIELD_TO_RESOURCE_OPEN: state => ({
            ...state,
            addingField: true,
            error: null,
        }),
        ADD_FIELD_TO_RESOURCE_CANCEL: state => ({
            ...state,
            addingField: false,
            error: null,
        }),
        HIDE_RESOURCE_OPEN: state => ({
            ...state,
            hiding: true,
            error: null,
        }),
        HIDE_RESOURCE_CANCEL: state => ({
            ...state,
            hiding: false,
            error: null,
        }),
        CREATE_RESOURCE_OPEN: state => ({
            ...state,
            isCreating: true,
            error: null,
        }),
        CREATE_RESOURCE_CANCEL: state => ({
            ...state,
            isCreating: false,
            error: null,
        }),
        CREATE_RESOURCE_SUCCESS: state => ({
            ...state,
            isCreating: false,
            saving: false,
            error: null,
        }),
    },
    defaultState,
);

const getResourceLastVersion = (state, resource = state.resource) => {
    if (!resource) {
        return null;
    }
    const { versions, uri } = resource;
    if (!versions) {
        return null;
    }
    return {
        ...versions[versions.length - 1],
        uri,
    };
};

const hasBeenRemoved = (state, resource = state.resource) => {
    if (!resource) {
        return null;
    }

    return !!resource.removedAt;
};

const getResourceProposedFields = state => {
    const { contributions } = state.resource;
    if (!contributions) {
        return [];
    }
    return contributions
        .filter(({ status }) => status === PROPOSED)
        .map(({ fieldName }) => fieldName);
};

const getProposedFieldStatus = state => {
    const { contributions } = state.resource;
    if (!contributions) {
        return {};
    }

    return contributions.reduce(
        (acc, { fieldName, status }) => ({
            ...acc,
            [fieldName]: status,
        }),
        {},
    );
};

const getFieldStatus = createSelector(
    getProposedFieldStatus,
    (_, { name }) => name,
    (fieldStatusByName, name) => fieldStatusByName[name],
);

const getResourceContributions = state => state.resource.contributions || [];

const getResourceContributorsCatalog = createSelector(
    getResourceContributions,
    contributions =>
        contributions.filter(({ contributor }) => !!contributor).reduce(
            (acc, { fieldName, contributor: { name } }) => ({
                ...acc,
                [fieldName]: name,
            }),
            {},
        ),
);

const getResourceContributorForField = createSelector(
    getResourceContributorsCatalog,
    (_, fieldName) => fieldName,
    (contributorsCatalog, fieldName) => contributorsCatalog[fieldName],
);

const getRemovedData = state => {
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

const getVersions = state =>
    state.resource.versions.map(({ publicationDate }) => publicationDate);

const getNbVersions = state =>
    (state.resource &&
        state.resource.versions &&
        state.resource.versions.length) ||
    0;

const getSelectedVersion = createSelector(
    state => state.selectedVersion,
    getNbVersions,
    (selectedVersion, nbVersions) =>
        selectedVersion !== null ? selectedVersion : nbVersions - 1,
);

const getResourceSelectedVersion = createSelector(
    state => state.resource,
    getSelectedVersion,
    (resource, selectedVersion) => {
        if (!resource) {
            return null;
        }
        const { versions, uri } = resource;
        if (!versions) {
            return null;
        }
        return {
            ...versions[selectedVersion],
            uri,
        };
    },
);

const isLastVersionSelected = createSelector(
    getSelectedVersion,
    getNbVersions,
    (selectedVersion, nbVersions) => selectedVersion === nbVersions - 1,
);

const isAdding = state => state.addingField;

const isHiding = state => state.hiding;

const getError = ({ error }) => error;

const isCreating = state => state.isCreating;

const isResourceLoaded = (state, uri) =>
    !state.loading && state.resource && state.resource.uri === uri;

export const fromResource = {
    getResourceContributorsCatalog,
    getResourceSelectedVersion,
    getResourceLastVersion,
    getResourceProposedFields,
    getResourceContributions,
    getResourceContributorForField,
    getRemovedData,
    isSaving,
    isLoading,
    getProposedFieldStatus,
    getFieldStatus,
    getVersions,
    getSelectedVersion,
    isLastVersionSelected,
    isAdding,
    isHiding,
    getError,
    hasBeenRemoved,
    isCreating,
    isResourceLoaded,
};

export const getResourceFormData = state => state.form.resource.values;
export const getHideResourceFormData = state => state.form.hideResource.values;
export const getNewResourceFieldFormData = state =>
    state.form.newResourceField && state.form.newResourceField.values;
export const getNewResourceFormData = state =>
    state.form[CREATE_RESOURCE_FORM_NAME] &&
    state.form[CREATE_RESOURCE_FORM_NAME].values;
