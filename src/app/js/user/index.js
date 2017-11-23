import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import omit from 'lodash.omit';

import getQueryString from '../lib/getQueryString';

export const LOGIN_FORM_NAME = 'login';
export const TOGGLE_LOGIN = 'TOGGLE_LOGIN';
export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const SIGNOUT = 'SIGNOUT';

export const defaultState = {
    showModal: false,
    token: null,
};

export default handleActions(
    {
        TOGGLE_LOGIN: state => ({
            ...state,
            showModal: !state.showModal,
        }),
        LOGIN_SUCCESS: (state, { payload }) => ({
            ...state,
            showModal: false,
            token: payload,
        }),
        LOGOUT: state => ({
            ...state,
            showModal: true,
            token: null,
        }),
        SIGNOUT: state => ({
            ...state,
            showModal: false,
            token: null,
        }),
    },
    defaultState,
);

export const toggleLogin = createAction(TOGGLE_LOGIN);
export const login = createAction(LOGIN);
export const loginSuccess = createAction(LOGIN_SUCCESS);
export const logout = createAction(LOGOUT);
export const signOut = createAction(SIGNOUT);

export const isLoggedIn = state => !!state.token;
export const getToken = state => state.token;
export const isUserModalShown = state => state.showModal;

export const getRequest = createSelector(
    getToken,
    (_, props) => props,
    (token, { body, method = 'GET', url }) => ({
        url,
        body: JSON.stringify(body),
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        method,
    }),
);

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

export const getVerifyUriRequest = state =>
    getRequest(state, {
        url: '/api/publish/verifyUri',
        method: 'GET',
    });

export const getClearPublishedRequest = state =>
    getRequest(state, {
        url: '/api/publish',
        method: 'DELETE',
    });

export const getLoadRemovedResourcePageRequest = (state, { page, perPage }) =>
    getRequest(state, {
        url: `/api/publishedDataset/removed?page=${encodeURIComponent(
            page,
        )}&perPage=${encodeURIComponent(perPage)}`,
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

export const getAddCharacteristicRequest = (state, newCharacteristics) =>
    getRequest(state, {
        url: '/api/characteristic',
        method: 'POST',
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
        url: `/api/publishedDataset/ark?uri=${encodeURIComponent(uri)}`,
    });

export const getSaveResourceRequest = (state, resource) =>
    getRequest(state, {
        url: '/api/publishedDataset',
        method: 'PUT',
        body: resource,
    });

export const getHideResourceRequest = (state, data) =>
    getRequest(state, {
        url: '/api/publishedDataset',
        method: 'DELETE',
        body: data,
    });

export const getClearDatasetRequest = state =>
    getRequest(state, {
        url: '/api/dataset',
        method: 'DELETE',
    });

export const getAddFieldToResourceRequest = (state, data) =>
    getRequest(state, {
        url: '/api/publishedDataset/add_field',
        method: 'PUT',
        body: data,
    });

export const getCreateResourceRequest = (state, data) =>
    getRequest(state, {
        url: '/api/publishedDataset',
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

export const getLoadContributedResourcePageRequest = (
    state,
    { page, perPage, filter },
) => {
    const encodedPage = encodeURIComponent(page);
    const encodedPerPage = encodeURIComponent(perPage);

    return getRequest(state, {
        url: `/api/publishedDataset/${filter}?page=${encodedPage}&perPage=${
            encodedPerPage
        }`,
    });
};

export const getChangeFieldStatusRequest = (state, { uri, field, status }) =>
    getRequest(state, {
        method: 'PUT',
        url: `/api/publishedDataset/${encodeURIComponent(
            uri,
        )}/change_contribution_status/${field}/${status}`,
    });

export const getLoadExportersRequest = state =>
    getRequest(state, {
        url: '/api/export',
    });

export const getClearUploadRequest = state =>
    getRequest(state, {
        method: 'DELETE',
        url: '/api/upload/clear',
    });

export const getUploadUrlRequest = (state, url) =>
    getRequest(state, {
        method: 'POST',
        url: '/api/upload/url',
        body: {
            url,
        },
    });

export const selectors = {
    isLoggedIn,
    getToken,
    getRequest,
    isUserModalShown,
    getLoginRequest,
    getClearUploadRequest,
    getClearDatasetRequest,
    getClearPublishedRequest,
    getLoadExportersRequest,
    getChangeFieldStatusRequest,
    getLoadContributedResourcePageRequest,
    getLoadFacetValuesRequest,
    getExportFieldsRequest,
    getCreateResourceRequest,
    getAddFieldToResourceRequest,
    getHideResourceRequest,
    getSaveResourceRequest,
    getLoadResourceRequest,
    getLoadPublicationRequest,
    getLoadDatasetPageRequest,
    getAddCharacteristicRequest,
    getUpdateCharacteristicsRequest,
    getRestoreResourceRequest,
    getLoadRemovedResourcePageRequest,
    getVerifyUriRequest,
    getPublishRequest,
    getLoadParsingResultRequest,
    getRemoveFieldRequest,
    getSaveFieldRequest,
    getUpdateFieldRequest,
    getCreateFieldRequest,
    getLoadFieldRequest,
    getUploadUrlRequest,
};
