// @ts-expect-error TS7016
import { createAction, handleActions, combineActions } from 'redux-actions';
import { createSelector } from 'reselect';
import get from 'lodash/get';

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

export const HIDE_RESOURCE_FORM_NAME = 'hideResource';
export const NEW_RESOURCE_FIELD_FORM_NAME = 'newResourceField';

export const CHANGE_FIELD_STATUS = 'CHANGE_FIELD_STATUS';
export const CHANGE_FIELD_STATUS_SUCCESS = 'CHANGE_FIELD_STATUS_SUCCESS';
export const CHANGE_FIELD_STATUS_ERROR = 'CHANGE_FIELD_STATUS_ERROR';
export const SELECT_VERSION = 'SELECT_VERSION';

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

export const defaultState = {
    resource: null,
    error: null,
    loading: true,
    saving: false,
    addingField: false,
    hiding: false,
    selectedVersion: 0,
};

export default handleActions(
    {
        // @ts-expect-error TS7006
        [combineActions('@@INIT', PRE_LOAD_RESOURCE)]: (state) => ({
            ...state,
            loading: true,
        }),
        // @ts-expect-error TS7006
        LOAD_RESOURCE: (state) => ({
            ...state,
            resource: null,
            selectedVersion: 0,
            error: null,
            loading: true,
            saving: false,
        }),
        // @ts-expect-error TS7006
        LOAD_RESOURCE_SUCCESS: (state, { payload }) => {
            const versions = get(payload, 'versions', []);
            return {
                ...state,
                resource: payload,
                selectedVersion: versions.length - 1,
                error: null,
                loading: false,
                saving: false,
            };
        },
        // @ts-expect-error TS7006
        LOAD_RESOURCE_ERROR: (state, { payload: error }) => ({
            ...state,
            error: error.message,
            loading: false,
            saving: false,
        }),
        [combineActions(SAVE_RESOURCE, HIDE_RESOURCE, ADD_FIELD_TO_RESOURCE)]: (
            // @ts-expect-error TS7006
            state,
        ) => ({
            ...state,
            error: null,
            saving: true,
        }),
        // @ts-expect-error TS7006
        SAVE_RESOURCE_SUCCESS: (state, { payload }) => {
            const resource = payload || state.resource;
            const versions = get(resource, 'versions', []);
            return {
                ...state,
                resource,
                selectedVersion: versions.length - 1,
                error: null,
                saving: false,
            };
        },
        [HIDE_RESOURCE_SUCCESS]: (
            // @ts-expect-error TS7031
            { resource, ...state },
            // @ts-expect-error TS7031
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
        // @ts-expect-error TS7006
        [ADD_FIELD_TO_RESOURCE_SUCCESS]: (state, { payload: { resource } }) => {
            const versions = get(resource, 'versions', []);
            return {
                ...state,
                resource,
                selectedVersion: versions.length - 1,
                error: null,
                loading: false,
                addingField: null,
                saving: false,
            };
        },
        [combineActions(
            SAVE_RESOURCE_ERROR,
            HIDE_RESOURCE_ERROR,
            ADD_FIELD_TO_RESOURCE_ERROR,
            // @ts-expect-error TS7006
        )]: (state, { payload: error }) => ({
            ...state,
            error: error.message,
            saving: false,
        }),
        // @ts-expect-error TS7006
        CHANGE_FIELD_STATUS: (state, { payload: { field, status } }) => {
            const { contributions } = state.resource;
            const index = contributions.findIndex(
                // @ts-expect-error TS7031
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
            // @ts-expect-error TS7006
            state,
            // @ts-expect-error TS7031
            { payload: { error, field, prevStatus } },
        ) => {
            const { contributions } = state.resource;
            const index = contributions.findIndex(
                // @ts-expect-error TS7031
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
        // @ts-expect-error TS7006
        CHANGE_FIELD_STATUS_SUCCESS: (state) => ({
            ...state,
            error: null,
            moderating: false,
        }),
        // @ts-expect-error TS7006
        SELECT_VERSION: (state, { payload: selectedVersion }) => ({
            ...state,
            selectedVersion,
        }),
        // @ts-expect-error TS7006
        ADD_FIELD_TO_RESOURCE_OPEN: (state) => ({
            ...state,
            addingField: true,
            error: null,
        }),
        // @ts-expect-error TS7006
        ADD_FIELD_TO_RESOURCE_CANCEL: (state) => ({
            ...state,
            addingField: false,
            error: null,
        }),
        // @ts-expect-error TS7006
        HIDE_RESOURCE_OPEN: (state) => ({
            ...state,
            hiding: true,
            error: null,
        }),
        // @ts-expect-error TS7006
        HIDE_RESOURCE_CANCEL: (state) => ({
            ...state,
            hiding: false,
            error: null,
        }),
    },
    defaultState,
);

// @ts-expect-error TS7006
const getResourceLastVersion = (state, resource = state.resource) => {
    if (!resource) {
        return null;
    }
    const { versions, uri, subresourceId } = resource;
    if (!versions) {
        return null;
    }
    return {
        ...versions[versions.length - 1],
        uri,
        subresourceId,
    };
};

// @ts-expect-error TS7006
const hasBeenRemoved = (state, resource = state.resource) => {
    if (!resource) {
        return false;
    }

    return !!resource.removedAt;
};

// @ts-expect-error TS7006
const getResourceProposedFields = (state) => {
    const contributions = get(state, 'resource.contributions');
    if (!contributions) {
        return [];
    }
    return (
        contributions
            // @ts-expect-error TS7031
            .filter(({ status }) => status === PROPOSED)
            // @ts-expect-error TS7031
            .map(({ fieldName }) => fieldName)
    );
};

// @ts-expect-error TS7006
const getProposedFieldStatus = (state) => {
    const contributions = get(state, 'resource.contributions');
    if (!contributions) {
        return {};
    }

    return contributions.reduce(
        // @ts-expect-error TS7006
        (acc, { fieldName, status }) => ({
            ...acc,
            [fieldName]: status,
        }),
        {},
    );
};

const getFieldStatus = createSelector(
    getProposedFieldStatus,
    // @ts-expect-error TS7006
    (_, { name }) => name,
    (fieldStatusByName, name) => fieldStatusByName[name],
);

// @ts-expect-error TS7006
const getResourceContributions = (state) =>
    get(state, 'resource.contributions', []);

const getResourceContributorsCatalog = createSelector(
    getResourceContributions,
    (contributions) =>
        contributions
            // @ts-expect-error TS7031
            .filter(({ contributor }) => !!contributor)
            .reduce(
                // @ts-expect-error TS7006
                (acc, { fieldName, contributor: { name } }) => ({
                    ...acc,
                    [fieldName]: name,
                }),
                {},
            ),
);

const getResourceContributorForField = createSelector(
    getResourceContributorsCatalog,
    // @ts-expect-error TS7006
    (_, fieldName) => fieldName,
    (contributorsCatalog, fieldName) => contributorsCatalog[fieldName],
);

// @ts-expect-error TS7006
const getRemovedData = (state) => {
    const resource = state.resource;
    if (!resource) {
        return {};
    }
    const { uri, removedAt, reason } = resource;
    return {
        uri,
        removedAt,
        reason,
    };
};

// @ts-expect-error TS7006
const isSaving = (state) => state.saving;

// @ts-expect-error TS7006
const isLoading = (state) => state.loading;

// @ts-expect-error TS7031
const getVersions = ({ resource }) => {
    const versions = get(resource, 'versions', []);
    // @ts-expect-error TS7031
    return versions.map(({ publicationDate }) => publicationDate);
};

// @ts-expect-error TS7031
const getNbVersions = ({ resource }) =>
    (resource && resource.versions && resource.versions.length) || 0;

const getSelectedVersion = createSelector(
    // @ts-expect-error TS2339
    (state) => state.selectedVersion,
    getNbVersions,
    (selectedVersion, nbVersions) =>
        selectedVersion !== null ? selectedVersion : nbVersions - 1,
);

const getResourceSelectedVersion = createSelector(
    (state) => state.resource,
    getSelectedVersion,
    (resource, selectedVersion) => {
        if (!resource) {
            return null;
        }
        const { versions, uri, subresourceId } = resource;
        if (!versions) {
            return null;
        }
        return {
            ...versions[selectedVersion],
            uri,
            subresourceId,
        };
    },
);

const isLastVersionSelected = createSelector(
    getSelectedVersion,
    getNbVersions,
    (selectedVersion, nbVersions) => selectedVersion === nbVersions - 1,
);

// @ts-expect-error TS7006
const isAdding = (state) => state.addingField;

// @ts-expect-error TS7006
const isHiding = (state) => state.hiding;

// @ts-expect-error TS7031
const getError = ({ error }) => error;

// @ts-expect-error TS7006
const isCreating = (state) => state.isCreating;

// @ts-expect-error TS7006
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

// @ts-expect-error TS7006
export const getResourceFormData = (state) =>
    get(state, 'form.resource.values');
// @ts-expect-error TS7006
export const getHideResourceFormData = (state) =>
    get(state, 'form.hideResource.values');
// @ts-expect-error TS7006
export const getNewResourceFieldFormData = (state) =>
    get(state, 'form.newResourceField.values');
