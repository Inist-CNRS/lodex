import { createAction, handleActions } from 'redux-actions';
import omit from 'lodash.omit';

import { getRequest } from '../user';
import getQueryString from '../lib/getQueryString';

export const FETCH = 'FETCH';
export const FETCH_ERROR = 'FETCH_ERROR';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';

export const fetch = createAction(FETCH, ({ config }) => config, ({ name }) => ({ name }));
export const fetchError = createAction(FETCH_ERROR, ({ error }) => error, ({ name }) => ({ name }));
export const fetchSuccess = createAction(FETCH_SUCCESS, ({ response }) => response, ({ name }) => ({ name }));

export const defaultState = {};

export default handleActions({
    FETCH: (state, { payload: config, meta: { name } }) => ({
        ...state,
        [name]: {
            ...config,
            error: null,
            loading: true,
            response: null,
        },
    }),
    FETCH_ERROR: (state, { payload: error, meta: { name } }) => ({
        ...state,
        [name]: {
            ...state[name],
            error,
            loading: false,
            response: null,
        },
    }),
    FETCH_SUCCESS: (state, { payload: response, meta: { name } }) => ({
        ...state,
        [name]: {
            ...state[name],
            error: null,
            loading: false,
            response,
        },
    }),
}, defaultState);

export const getLoginRequest = (state, credentials) =>
    getRequest(state, {
        url: '/api/login',
        body: credentials,
        method: 'POST',
    });

export const getLoadFieldRequest = state =>
    getRequest(state, {
        url: '/api/field',
    });

export const getCreateFieldRequest = (state, fieldData) =>
    getRequest(state, {
        url: '/api/field',
        body: fieldData,
        method: 'POST',
    });

export const getUpdateFieldRequest = (state, { _id, ...fieldData }) =>
    getRequest(state, {
        url: `/api/field/${_id}`,
        body: fieldData,
        method: 'PUT',
    });

export const getSaveFieldRequest = (state, fieldData) => {
    if (fieldData.name === 'new') {
        return getCreateFieldRequest(state, omit(fieldData, ['name']));
    }

    return getUpdateFieldRequest(state, fieldData);
};

export const getRemoveFieldRequest = (state, { _id }) =>
    getRequest(state, {
        url: `/api/field/${_id}`,
        method: 'DELETE',
    });

export const getLoadParsingResultRequest = state =>
    getRequest(state, {
        url: '/api/parsing',
    });

export const getPublishRequest = state =>
    getRequest(state, {
        url: '/api/publish',
        method: 'POST',
    });

export const getLoadRemovedResourcePageRequest = (state, { page, perPage }) =>
    getRequest(state, {
        url: `/api/publishedDataset/removed?page=${encodeURIComponent(page)}&perPage=${encodeURIComponent(perPage)}`,
    });

export const getRestoreResourceRequest = (state, uri) =>
    getRequest(state, {
        url: '/api/publishedDataset/restore',
        body: { uri },
        method: 'PUT',
    });

export const getUpdateCharacteristicsRequest = (state, newCharacteristics) =>
    getRequest(state, {
        url: '/api/characteristic',
        method: 'PUT',
        body: newCharacteristics,
    });

export const getLoadDatasetPageRequest = (state, params = {}) => {
    const paramString = getQueryString(params);

    return getRequest(state, {
        url: `/api/publishedDataset?${paramString}`,
    });
};

export const getLoadPublicationRequest = state =>
    getRequest(state, {
        url: '/api/publication',
    });

export const getLoadResourceRequest = (state, uri) =>
    getRequest(state, {
        url: `/api/ark?uri=${uri}`,

    });

export const getSaveResourceRequest = (state, resource) =>
    getRequest(state, {
        url: '/api/publishedDataset',
        method: 'POST',
        body: resource,
    });

export const getHideResourceRequest = (state, data) =>
    getRequest(state, {
        url: '/api/publishedDataset',
        method: 'DELETE',
        body: data,

    });

export const getAddFieldToResourceRequest = (state, data) =>
    getRequest(state, {
        url: '/api/publishedDataset/add_field',
        method: 'POST',
        body: data,
    });

export const getExportFieldsRequest = state =>
    getRequest(state, {
        url: '/api/field/export',
    });

export const getLoadFacetValuesRequest = (state, { field, filter }) =>
    getRequest(state, {
        url: `/api/facet/${field}/${filter || ''}`,
    });

export const getLoadContributedResourcePageRequest = (state, { page, perPage, filter }) => {
    const encodedPage = encodeURIComponent(page);
    const encodedPerPage = encodeURIComponent(perPage);

    return getRequest(state, {
        url: `/api/publishedDataset/contributed/${filter}?page=${encodedPage}&perPage=${encodedPerPage}`,
    });
};

export const getChangeFieldStatusRequest = (state, { uri, field, status }) =>
    getRequest(state, {
        method: 'PUT',
        url: `/api/publishedDataset/${uri}/change_contribution_status/${field}/${status}`,
    });
