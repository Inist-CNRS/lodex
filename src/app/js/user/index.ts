import omit from 'lodash/omit';
import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

import { ADMIN_ROLE } from '../../../common/tools/tenantTools';
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
        TOGGLE_LOGIN: (state) => ({
            ...state,
            showModal: !state.showModal,
        }),
        // @ts-expect-error TS7006
        LOGIN_SUCCESS: (state, { payload: { token, role } }) => ({
            ...state,
            showModal: false,
            token: token,
            role,
        }),
        LOGOUT: (state) => ({
            ...state,
            showModal: true,
            token: null,
            role: null,
        }),
        SIGNOUT: (state) => ({
            ...state,
            showModal: false,
            token: null,
            role: null,
        }),
    },
    defaultState,
);

export const toggleLogin = createAction(TOGGLE_LOGIN);
export const login = createAction(LOGIN);
export const loginSuccess = createAction(LOGIN_SUCCESS);
export const logout = createAction(LOGOUT);
export const signOut = createAction(SIGNOUT);

// @ts-expect-error TS7006
export const isAdmin = (state) => state.role === ADMIN_ROLE;
// @ts-expect-error TS7006
export const getRole = (state) => state.role || 'not logged';
// @ts-expect-error TS7006
export const getToken = (state) => state.token;
// @ts-expect-error TS7006
export const getCookie = (state) => state.cookie;
// @ts-expect-error TS7006
export const isUserModalShown = (state) => state.showModal;

export const getRequest = createSelector(
    getToken,
    getCookie,
    // @ts-expect-error TS7006
    (_, props) => props,
    (
        token,
        cookie,
        {
            body,
            method = 'GET',
            url,
            credentials = 'same-origin',
            cook = true,
            auth = true,
            head = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
    ) => {
        if (cook) {
            head['Cookie'] = cookie;
        }
        if (auth) {
            head['Authorization'] = `Bearer ${token}`;
        }
        if (typeof body === 'object' && !(body instanceof Blob)) {
            body = JSON.stringify(body);
        }

        return {
            url,
            body,
            credentials,
            headers: head,
            method,
        };
    },
);

// @ts-expect-error TS7006
export const getLoginRequest = (state, credentials) =>
    getRequest(state, {
        url: '/api/login',
        body: credentials,
        method: 'POST',
    });

// @ts-expect-error TS7006
export const getLogoutRequest = (state) =>
    getRequest(state, {
        url: '/api/logout',
        method: 'POST',
    });

// @ts-expect-error TS7006
export const getLoadSubresourcesRequest = (state) =>
    getRequest(state, {
        url: '/api/subresource',
    });

// @ts-expect-error TS7006
export const getLoadEnrichmentsRequest = (state) =>
    getRequest(state, {
        url: '/api/enrichment',
    });

// @ts-expect-error TS7006
export const getEnrichmentActionRequest = (state, { action, id }) =>
    getRequest(state, {
        url: `/api/enrichment/${action}/${id}`,
        method: 'POST',
    });

// @ts-expect-error TS7006
export const getEnrichmentLaunchAllRequest = (state) =>
    getRequest(state, {
        url: `/api/enrichment/launchAll`,
        method: 'POST',
    });

// @ts-expect-error TS7006
export const getEnrichmentRetryRequest = (state, { id }) =>
    getRequest(state, {
        url: `/api/enrichment/retry/${id}`,
        method: 'POST',
    });

// @ts-expect-error TS7006
export const getCreateSubresourceRequest = (state, body) =>
    getRequest(state, {
        url: '/api/subresource',
        method: 'POST',
        body,
    });

// @ts-expect-error TS7006
export const getCreateEnrichmentRequest = (state, body) =>
    getRequest(state, {
        url: '/api/enrichment',
        method: 'POST',
        body,
    });

// @ts-expect-error TS7006
export const getPreviewDataEnrichmentRequest = (state, body) =>
    getRequest(state, {
        url: '/api/enrichment/preview',
        method: 'POST',
        body,
    });

// @ts-expect-error TS7006
export const getUpdateEnrichmentRequest = (state, enrichment) =>
    getRequest(state, {
        url: `/api/enrichment/${enrichment._id}`,
        method: 'PUT',
        body: enrichment,
    });

// @ts-expect-error TS7006
export const getDeleteEnrichmentRequest = (state, id) =>
    getRequest(state, {
        url: `/api/enrichment/${id}`,
        method: 'DELETE',
    });

// @ts-expect-error TS7006
export const getConfigTenantAvailableThemeRequest = (state) =>
    getRequest(state, {
        url: '/api/themes',
        method: 'GET',
    });

// @ts-expect-error TS7006
export const getConfigTenantRequest = (state) =>
    getRequest(state, {
        url: `/api/config-tenant`,
        method: 'GET',
    });

// @ts-expect-error TS7006
export const getUpdateConfigTenantRequest = (state, configTenant) =>
    getRequest(state, {
        url: `/api/config-tenant/${configTenant._id}`,
        method: 'PUT',
        body: configTenant,
    });

// @ts-expect-error TS7006
export const getLoadPrecomputedRequest = (state) =>
    getRequest(state, {
        url: '/api/precomputed',
    });

// @ts-expect-error TS7006
export const getPrecomputedActionRequest = (state, { action, id }) =>
    getRequest(state, {
        url: `/api/precomputed/${action}/${id}`,
        method: 'POST',
    });

// @ts-expect-error TS7006
export const getCreatePrecomputedRequest = (state, body) =>
    getRequest(state, {
        url: '/api/precomputed',
        method: 'POST',
        body,
    });

// @ts-expect-error TS7006
export const getPreviewDataPrecomputedRequest = (state, body) =>
    getRequest(state, {
        url: '/api/precomputed/preview',
        method: 'POST',
        body,
    });

// @ts-expect-error TS7006
export const getUpdatePrecomputedRequest = (state, precomputed) =>
    getRequest(state, {
        url: `/api/precomputed/${precomputed._id}`,
        method: 'PUT',
        body: precomputed,
    });

// @ts-expect-error TS7006
export const getDeletePrecomputedRequest = (state, id) =>
    getRequest(state, {
        url: `/api/precomputed/${id}`,
        method: 'DELETE',
    });

// @ts-expect-error TS7006
export const getUpdateSubresourceRequest = (state, { _id, ...body }) =>
    getRequest(state, {
        url: `/api/subresource/${_id}`,
        method: 'PUT',
        body,
    });

// @ts-expect-error TS7006
export const getDeleteSubresourceRequest = (state, id) =>
    getRequest(state, {
        url: `/api/subresource/${id}`,
        method: 'DELETE',
    });

// @ts-expect-error TS7006
export const getLoadFieldRequest = (state) =>
    getRequest(state, {
        url: '/api/field',
    });

// @ts-expect-error TS7006
export const getCreateFieldRequest = (state, fieldData) =>
    getRequest(state, {
        url: '/api/field',
        body: fieldData,
        method: 'POST',
    });

// @ts-expect-error TS7006
export const getUpdateFieldRequest = (state, { _id, ...fieldData }) =>
    getRequest(state, {
        url: `/api/field/${_id}`,
        body: fieldData,
        method: 'PATCH',
    });

// @ts-expect-error TS7006
export const getPatchSearchableFieldsRequest = (state, fieldsData) =>
    getRequest(state, {
        url: `/api/field/searchable`,
        body: fieldsData,
        method: 'PATCH',
    });

// @ts-expect-error TS7006
export const getPatchOverviewRequest = (state, fieldData) =>
    getRequest(state, {
        url: `/api/field/overview`,
        body: fieldData,
        method: 'PATCH',
    });

// @ts-expect-error TS7006
export const getPatchSortFieldRequest = (state, body) =>
    getRequest(state, {
        url: `/api/field/sort-field`,
        body,
        method: 'PATCH',
    });

// @ts-expect-error TS7006
export const getPatchSortOrderRequest = (state, body) =>
    getRequest(state, {
        url: `/api/field/sort-order`,
        body,
        method: 'PATCH',
    });

// @ts-expect-error TS7006
export const getSaveFieldRequest = (state, fieldData) => {
    if (fieldData.name === 'new') {
        return getCreateFieldRequest(state, omit(fieldData, ['name']));
    }

    return getUpdateFieldRequest(state, fieldData);
};

// @ts-expect-error TS7006
export const getRemoveFieldRequest = (state, { _id }) =>
    getRequest(state, {
        url: `/api/field/${_id}`,
        method: 'DELETE',
    });

// @ts-expect-error TS7006
export const getLoadParsingResultRequest = (state) =>
    getRequest(state, {
        url: '/api/parsing',
    });

// @ts-expect-error TS7006
export const getPublishRequest = (state) =>
    getRequest(state, {
        url: '/api/publish',
        method: 'POST',
    });

// @ts-expect-error TS7006
export const getClearPublishedRequest = (state) =>
    getRequest(state, {
        url: '/api/publish',
        method: 'DELETE',
    });

// @ts-expect-error TS7006
export const getLoadRemovedResourcePageRequest = (state, { page, perPage }) =>
    getRequest(state, {
        url: `/api/publishedDataset/removed?page=${encodeURIComponent(
            page,
        )}&perPage=${encodeURIComponent(perPage)}`,
    });

// @ts-expect-error TS7006
export const getRestoreResourceRequest = (state, uri) =>
    getRequest(state, {
        url: '/api/publishedDataset/restore',
        body: { uri },
        method: 'PUT',
    });

// @ts-expect-error TS7006
export const getUpdateCharacteristicsRequest = (state, newCharacteristics) =>
    getRequest(state, {
        url: '/api/characteristic',
        method: 'PUT',
        body: newCharacteristics,
    });

// @ts-expect-error TS7006
export const getAddCharacteristicRequest = (state, newCharacteristics) =>
    getRequest(state, {
        url: '/api/characteristic',
        method: 'POST',
        body: newCharacteristics,
    });

// @ts-expect-error TS7006
export const getLoadDatasetPageRequest = (state, params = {}) => {
    return getRequest(state, {
        url: `/api/publishedDataset`,
        method: 'POST',
        body: params,
    });
};

// @ts-expect-error TS7006
export const getLoadPublicationRequest = (state) =>
    getRequest(state, {
        url: '/api/publication',
    });

// @ts-expect-error TS7006
export const getLoadResourceRequest = (state, uri) =>
    getRequest(state, {
        url: `/api/publishedDataset/ark?uri=${encodeURIComponent(
            uri,
        )}&applyFormat=true`,
    });

// @ts-expect-error TS7006
export const getSaveResourceRequest = (state, { resource, field }) =>
    getRequest(state, {
        url: '/api/publishedDataset',
        method: 'PUT',
        body: {
            resource,
            field,
        },
    });

// @ts-expect-error TS7006
export const getHideResourceRequest = (state, data) =>
    getRequest(state, {
        url: '/api/publishedDataset',
        method: 'DELETE',
        body: data,
    });

// @ts-expect-error TS7006
export const getGetDatasetRequest = (state, params) => {
    const paramString = getQueryString(params);
    return getRequest(state, {
        url: `/api/dataset?${paramString}`,
        method: 'GET',
    });
};

// @ts-expect-error TS7006
export const putUpdateDataset = (state, data) =>
    getRequest(state, {
        url: '/api/dataset',
        method: 'PUT',
        body: data,
    });

// @ts-expect-error TS7006
export const getGetDatasetColumnsRequest = (state) => {
    return getRequest(state, {
        url: `/api/dataset/columns`,
        method: 'GET',
    });
};

// @ts-expect-error TS7006
export const getDeleteManyDatasetRowRequest = (state, ids) => {
    return getRequest(state, {
        url: `/api/dataset/batch-delete-id?ids=${encodeURIComponent(ids.join(','))}`,
        method: 'DELETE',
    });
};

export const getDeleteFilteredDatasetRowRequest = (
    // @ts-expect-error TS7006
    state,
    // @ts-expect-error TS7031
    { columnField, operatorValue, value },
) => {
    return getRequest(state, {
        url: `/api/dataset/batch-delete-filter?filterBy=${encodeURIComponent(
            columnField,
        )}&filterOperator=${encodeURIComponent(
            operatorValue,
        )}&filterValue=${encodeURIComponent(value)}`,
        method: 'DELETE',
    });
};

// @ts-expect-error TS7006
export const getClearDatasetRequest = (state) =>
    getRequest(state, {
        url: '/api/dataset',
        method: 'DELETE',
    });

// @ts-expect-error TS7006
export const getDumpDatasetRequest = (state, fields) => {
    const searchParams = new URLSearchParams();
    fields.forEach((field) => searchParams.append('fields[]', field));
    return getRequest(state, {
        url: `/api/dump?${searchParams.toString()}`,
        method: 'GET',
    });
};

// @ts-expect-error TS7006
export const getAddFieldToResourceRequest = (state, data) =>
    getRequest(state, {
        url: '/api/publishedDataset/add_field',
        method: 'PUT',
        body: data,
    });

// @ts-expect-error TS7006
export const getCreateResourceRequest = (state, data) =>
    getRequest(state, {
        url: '/api/publishedDataset',
        method: 'POST',
        body: data,
    });

// @ts-expect-error TS7006
export const getExportFieldsRequest = (state) =>
    getRequest(state, {
        url: '/api/field/export',
    });

// @ts-expect-error TS7006
export const getExportFieldsReadyRequest = (state) =>
    getRequest(state, {
        url: '/api/field/export/ready',
    });

export const getLoadFacetValuesRequest = (
    // @ts-expect-error TS7006
    state,
    // @ts-expect-error TS7031
    { field, filter, currentPage = 0, perPage = 10, sort = {} },
) =>
    getRequest(state, {
        url: `/api/facet/${field}/${filter || ''}?${getQueryString({
            // @ts-expect-error TS2345
            page: currentPage,
            perPage,
            sort,
        })}`,
    });

// @ts-expect-error TS7006
export const getChangeFieldStatusRequest = (state, { uri, field, status }) =>
    getRequest(state, {
        method: 'PUT',
        url: `/api/publishedDataset/${encodeURIComponent(
            uri,
        )}/change_contribution_status/${field}/${status}`,
    });

// @ts-expect-error TS7006
export const getLoadExportersRequest = (state) =>
    getRequest(state, {
        url: '/api/export',
    });

// @ts-expect-error TS7006
export const getClearUploadRequest = (state) =>
    getRequest(state, {
        method: 'DELETE',
        url: '/api/upload/clear',
    });

export const getUploadUrlRequest = (
    // @ts-expect-error TS7006
    state,
    // @ts-expect-error TS7031
    { url, loaderName, customLoader = null },
) =>
    getRequest(state, {
        method: 'POST',
        url: '/api/upload/url',
        body: {
            url,
            loaderName,
            customLoader,
        },
    });

export const getUploadTextRequest = (
    // @ts-expect-error TS7006
    state,
    // @ts-expect-error TS7031
    { text, loaderName, customLoader = null },
) =>
    getRequest(state, {
        method: 'POST',
        url: '/api/upload/text',
        body: {
            text,
            loaderName,
            customLoader,
        },
    });

// @ts-expect-error TS7006
export const getUrlRequest = (state, { url, queryString }) =>
    getRequest(state, {
        method: 'GET',
        url: `${url}${queryString ? `?${queryString}` : ''}`,
    });

// @ts-expect-error TS7006
export const getSparqlRequest = (state, { url, body }) => {
    return getRequest(state, {
        body,
        method: 'POST',
        url: url,
        cred: 'omit',
        cook: false,
        auth: false,
        head: {
            Accept: 'application/sparql-results+json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
};

// @ts-expect-error TS7006
export const getIstexRequest = (state, { url }) => {
    return getRequest(state, {
        method: 'GET',
        url,
        cred: 'omit',
        cook: false,
        auth: false,
        head: {
            Accept: 'application/sparql-results+json',
        },
    });
};

export const getExportPublishedDatasetRequest = (
    // @ts-expect-error TS7006
    state,
    // @ts-expect-error TS7031
    { type, queryString },
) =>
    getRequest(state, {
        method: 'GET',
        url: `/api/export/${type}?${queryString}`,
    });

// download pdf file
// @ts-expect-error TS7006
export const getExportPDFRequest = (state, options) => {
    const paramString = getQueryString(options);
    return getRequest(state, {
        method: 'GET',
        url: `/api/pdf?${paramString}`,
        head: {
            Accept: 'application/pdf',
        },
    });
};

// @ts-expect-error TS7006
export const getReorderFieldRequest = (state, fields) =>
    getRequest(state, {
        method: 'PUT',
        url: '/api/field/reorder',
        body: {
            // @ts-expect-error TS7031
            fields: fields.map(({ name }) => name),
        },
    });

// @ts-expect-error TS7006
export const getProgressRequest = (state) =>
    getRequest(state, {
        method: 'GET',
        url: '/api/progress',
    });

// @ts-expect-error TS7006
export const getBreadcrumbRequest = (state) =>
    getRequest(state, {
        method: 'GET',
        url: '/api/breadcrumb',
    });

// @ts-expect-error TS7006
export const getMenuRequest = (state) =>
    getRequest(state, {
        method: 'GET',
        url: '/api/menu',
    });

// @ts-expect-error TS7006
export const getDisplayConfigRequest = (state) =>
    getRequest(state, {
        method: 'GET',
        url: '/api/displayConfig',
    });

// @ts-expect-error TS7006
export const getLoadLoadersRequest = (state) =>
    getRequest(state, {
        url: '/api/loader',
    });

// @ts-expect-error TS7006
export const getJobLogsRequest = (state, jobId) =>
    getRequest(state, {
        url: `/api/job/${jobId}/logs`,
    });

// @ts-expect-error TS7006
export const getCancelJobRequest = (state, queue, subLabel) =>
    getRequest(state, {
        url: `/api/job/${queue}/cancel`,
        method: 'POST',
        body: { subLabel },
    });

// @ts-expect-error TS7006
export const getClearJobsRequest = (state) =>
    getRequest(state, {
        url: `/api/job/clear`,
        method: 'POST',
    });

// @ts-expect-error TS7006
export const getLoaderWithScriptRequest = (state, { name }) =>
    getRequest(state, {
        method: 'GET',
        url: `/api/loader/${name}`,
    });

// @ts-expect-error TS7006
export const postDuplicateField = (state, data) =>
    getRequest(state, {
        url: '/api/field/duplicate',
        method: 'POST',
        body: data,
    });

// @ts-expect-error TS7006
export const clearModelRequest = (state) =>
    getRequest(state, {
        url: '/api/field',
        method: 'DELETE',
    });

// @ts-expect-error TS7006
export const getThemeRequest = (state) =>
    getRequest(state, {
        url: '/api/themes/current',
        method: 'GET',
    });

// @ts-expect-error TS7006
export const getExportPrecomputedDataRequest = (state, id) => {
    return getRequest(state, {
        method: 'GET',
        url: `/api/precomputed/${id}/download`,
        head: {
            Accept: 'application/json',
        },
    });
};

// @ts-expect-error TS7006
export const getPreviewPrecomputedDataRequest = (state, id) => {
    return getRequest(state, {
        method: 'GET',
        url: `/api/precomputed/${id}/previewData`,
        head: {
            Accept: 'application/json',
        },
    });
};

// @ts-expect-error TS7006
export const getExportHiddenResources = (state) => {
    return getRequest(state, {
        url: '/api/hiddenResource/export',
        method: 'GET',
        head: {
            Accept: 'application/json',
        },
    });
};

// @ts-expect-error TS7006
export const getImportHiddenResources = (state, formData) => {
    const req = getRequest(state, {
        url: '/api/hiddenResource/import',
        method: 'POST',
    });
    delete req.headers['Content-Type'];
    req.body = formData;
    return req;
};

export const selectors = {
    isAdmin,
    getRole,
    getToken,
    getCookie,
    getRequest,
    isUserModalShown,
    getLoginRequest,
    getLogoutRequest,
    getClearUploadRequest,
    getClearDatasetRequest,
    getClearPublishedRequest,
    getLoadExportersRequest,
    getChangeFieldStatusRequest,
    getLoadFacetValuesRequest,
    getExportFieldsRequest,
    getDumpDatasetRequest,
    getExportFieldsReadyRequest,
    getCreateResourceRequest,
    getUpdateSubresourceRequest,
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
    getPublishRequest,
    getLoadParsingResultRequest,
    getRemoveFieldRequest,
    getSaveFieldRequest,
    getUpdateFieldRequest,
    getCreateFieldRequest,
    getLoadSubresourcesRequest,
    getLoadEnrichmentsRequest,
    getCreateSubresourceRequest,
    getCreateEnrichmentRequest,
    getUpdateEnrichmentRequest,
    getDeleteEnrichmentRequest,
    getEnrichmentActionRequest,
    getEnrichmentLaunchAllRequest,
    getEnrichmentRetryRequest,
    getLoadPrecomputedRequest,
    getCreatePrecomputedRequest,
    getUpdatePrecomputedRequest,
    getDeletePrecomputedRequest,
    getPrecomputedActionRequest,
    getLoadFieldRequest,
    getUploadUrlRequest,
    getUploadTextRequest,
    getUrlRequest,
    getExportPublishedDatasetRequest,
    getSparqlRequest,
    getReorderFieldRequest,
    getProgressRequest,
    getIstexRequest,
    getDeleteSubresourceRequest,
    getMenuRequest,
    getBreadcrumbRequest,
    getLoadLoadersRequest,
    getPreviewDataEnrichmentRequest,
    getPreviewDataPrecomputedRequest,
    getCancelJobRequest,
    getLoaderWithScriptRequest,
    postDuplicateField,
    clearModelRequest,
    getPatchSearchableFieldsRequest,
    getDeleteManyDatasetRowRequest,
    getExportPDFRequest,
    getDisplayConfigRequest,
    getConfigTenantRequest,
    getUpdateConfigTenantRequest,
    getThemeRequest,
    getExportPrecomputedDataRequest,
    getPreviewPrecomputedDataRequest,
    getExportHiddenResources,
    getImportHiddenResources,
};
