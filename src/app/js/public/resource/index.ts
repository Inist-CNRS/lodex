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

export const HIDE_RESOURCE_SUCCESS = 'HIDE_RESOURCE_SUCCESS';

export const ADD_FIELD_TO_RESOURCE = 'ADD_FIELD_TO_RESOURCE';
export const ADD_FIELD_TO_RESOURCE_OPEN = 'ADD_FIELD_TO_RESOURCE_OPEN';
export const ADD_FIELD_TO_RESOURCE_CANCEL = 'ADD_FIELD_TO_RESOURCE_CANCEL';
export const ADD_FIELD_TO_RESOURCE_SUCCESS = 'ADD_FIELD_TO_RESOURCE_SUCCESS';
export const ADD_FIELD_TO_RESOURCE_ERROR = 'ADD_FIELD_TO_RESOURCE_ERROR';

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

export const hideResourceSuccess = createAction(HIDE_RESOURCE_SUCCESS);

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

export type Contributor = {
    name: string;
};

export type Resource = {
    uri: string;
    versions: Array<any>;
    contributions: Array<{
        fieldName: string;
        status: string;
        contributor: Contributor;
    }>;
    removedAt?: string;
    reason?: string;
    subresourceId?: string;
    data?: unknown;
};

export type ResourceState = {
    resource: null | Resource;
    error: null | string;
    loading: boolean;
    saving: boolean;
    addingField: boolean | null;
    hiding: boolean;
    moderating: boolean;
    selectedVersion: number | null;
    isCreating?: boolean;
};

export const defaultState: ResourceState = {
    resource: null,
    error: null,
    loading: true,
    saving: false,
    addingField: false,
    hiding: false,
    selectedVersion: 0,
    moderating: false,
};

export default handleActions<ResourceState, any>(
    {
        [combineActions('@@INIT', PRE_LOAD_RESOURCE) as unknown as string]: (
            state: ResourceState,
        ) => ({
            ...state,
            loading: true,
        }),
        LOAD_RESOURCE: (state) => ({
            ...state,
            resource: null,
            selectedVersion: 0,
            error: null,
            loading: true,
            saving: false,
        }),
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
        LOAD_RESOURCE_ERROR: (state, { payload: error }) => ({
            ...state,
            error: error.message,
            loading: false,
            saving: false,
        }),
        [combineActions(
            SAVE_RESOURCE,
            ADD_FIELD_TO_RESOURCE,
        ) as unknown as string]: (state) => ({
            ...state,
            error: null,
            saving: true,
        }),
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
        HIDE_RESOURCE_SUCCESS: (
            { resource, ...state },
            {
                payload: { reason, removedAt },
            }: { payload: { reason: string; removedAt: string } },
        ) => ({
            ...state,
            error: null,
            hiding: false,
            saving: false,
            resource: {
                ...resource,
                reason,
                removedAt,
            } as Resource,
        }),
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
            ADD_FIELD_TO_RESOURCE_ERROR,
        ) as unknown as string]: (state, { payload: error }) => ({
            ...state,
            error: error.message,
            saving: false,
        }),
        CHANGE_FIELD_STATUS: (state, { payload: { field, status } }) => {
            const { contributions } = state.resource!;
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
                } as Resource,
            };
        },
        CHANGE_FIELD_STATUS_ERROR: (
            state,
            { payload: { error, field, prevStatus } },
        ) => {
            const { contributions } = state.resource!;
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
                } as Resource,
            };
        },
        CHANGE_FIELD_STATUS_SUCCESS: (state) => ({
            ...state,
            error: null,
            moderating: false,
        }),
        SELECT_VERSION: (state, { payload: selectedVersion }) => ({
            ...state,
            selectedVersion,
        }),
        ADD_FIELD_TO_RESOURCE_OPEN: (state) => ({
            ...state,
            addingField: true,
            error: null,
        }),
        ADD_FIELD_TO_RESOURCE_CANCEL: (state) => ({
            ...state,
            addingField: false,
            error: null,
        }),
    },
    defaultState,
);

const getResourceLastVersion = (
    state: ResourceState,
    resource = state.resource,
) => {
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

const hasBeenRemoved = (state: ResourceState, resource = state.resource) => {
    if (!resource) {
        return false;
    }

    return !!resource.removedAt;
};

const getResourceProposedFields = (state: ResourceState) => {
    const contributions = get(state, 'resource.contributions');
    if (!contributions) {
        return [];
    }
    return contributions
        .filter(({ status }) => status === PROPOSED)
        .map(({ fieldName }) => fieldName);
};

const getProposedFieldStatus = (state: ResourceState) => {
    const contributions = get(state, 'resource.contributions');
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
    (_: unknown, { name }: { name: string }) => name,
    // @ts-expect-error TS7006
    (fieldStatusByName, name) => fieldStatusByName[name],
);

const getResourceContributions = (state: ResourceState) =>
    get(state, 'resource.contributions', []);

const getResourceContributorsCatalog = createSelector(
    getResourceContributions,
    (contributions) =>
        contributions
            .filter(({ contributor }) => !!contributor)
            .reduce(
                (acc, { fieldName, contributor: { name } }) => ({
                    ...acc,
                    [fieldName]: name,
                }),
                {},
            ),
);

const getResourceContributorForField = createSelector(
    getResourceContributorsCatalog,
    (_: unknown, fieldName: string) => fieldName,
    (contributorsCatalog: Record<string, Contributor>, fieldName) =>
        contributorsCatalog[fieldName],
);

const getRemovedData = (state: ResourceState) => {
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

const isSaving = (state: ResourceState) => state.saving;

const isLoading = (state: ResourceState) => state.loading;

const getVersions = ({ resource }: ResourceState) => {
    const versions = get(resource, 'versions', []);
    return versions.map(({ publicationDate }) => publicationDate);
};

const getNbVersions = ({ resource }: ResourceState) =>
    (resource && resource.versions && resource.versions.length) || 0;

const getSelectedVersion = createSelector(
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

const isAdding = (state: ResourceState) => state.addingField;

const isHiding = (state: ResourceState) => state.hiding;

const getError = ({ error }: ResourceState) => error;

const isCreating = (state: ResourceState) => state.isCreating;

const isResourceLoaded = (state: ResourceState, uri: string) =>
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

export const getResourceFormData = (state: ResourceState) =>
    get(state, 'form.resource.values');
export const getHideResourceFormData = (state: ResourceState) =>
    get(state, 'form.hideResource.values');
export const getNewResourceFieldFormData = (state: ResourceState) =>
    get(state, 'form.newResourceField.values');
