import omit from 'lodash/omit';
import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

import { ADMIN_ROLE } from '@lodex/common';
import getQueryString from '../utils/getQueryString';

export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const SIGNOUT = 'SIGNOUT';

type UserState = {
    token: string | null;
    role?: 'admin' | 'user' | 'root' | null;
    cookie?: string | null;
};

export const defaultState: UserState = {
    token: null,
};

export default handleActions<UserState, any>(
    {
        LOGIN_SUCCESS: (state, { payload: { token, role } }) => ({
            ...state,
            token: token,
            role,
        }),
        LOGOUT: (state: UserState) => ({
            ...state,
            token: null,
            role: null,
        }),
        SIGNOUT: (state: UserState) => ({
            ...state,
            token: null,
            role: null,
        }),
    },
    defaultState,
);

export const login = createAction(LOGIN);
export const loginSuccess = createAction(LOGIN_SUCCESS);
export const logout = createAction(LOGOUT);
export const signOut = createAction(SIGNOUT);

export const isAdmin = (state: UserState) => state.role === ADMIN_ROLE;
export const getRole = (state: UserState) => state.role || 'not logged';
export const getToken = (state: UserState) => state.token;
export const getCookie = (state: UserState) => state.cookie;

type RequestProps = {
    body?: unknown;
    method?: string;
    url: string;
    credentials?: RequestCredentials;
    cook?: boolean;
    auth?: boolean;
    head?: Record<string, unknown>;
    cred?: RequestCredentials;
};

export const getRequest = createSelector(
    getToken,
    getCookie,
    (_: UserState, props: RequestProps) => props,
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
        }: RequestProps,
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

export const getLoginRequest = (
    state: UserState,
    credentials: {
        username: string;
        password: string;
    },
) =>
    getRequest(state, {
        url: '/api/login',
        body: credentials,
        method: 'POST',
    });

export const getLogoutRequest = (state: UserState) =>
    getRequest(state, {
        url: '/api/logout',
        method: 'POST',
    });

export const getLoadSubresourcesRequest = (state: UserState) =>
    getRequest(state, {
        url: '/api/subresource',
    });

export const getLoadEnrichmentsRequest = (state: UserState) =>
    getRequest(state, {
        url: '/api/enrichment',
    });

export const getEnrichmentActionRequest = (
    state: UserState,
    {
        action,
        id,
    }: {
        action: string;
        id: string;
    },
) =>
    getRequest(state, {
        url: `/api/enrichment/${action}/${id}`,
        method: 'POST',
    });

export const getEnrichmentLaunchAllRequest = (state: UserState) =>
    getRequest(state, {
        url: `/api/enrichment/launchAll`,
        method: 'POST',
    });

export const getEnrichmentRetryRequest = (
    state: UserState,
    {
        id,
    }: {
        id: string;
    },
) =>
    getRequest(state, {
        url: `/api/enrichment/retry/${id}`,
        method: 'POST',
    });

export const getCreateSubresourceRequest = (
    state: UserState,
    body: RequestProps['body'],
) =>
    getRequest(state, {
        url: '/api/subresource',
        method: 'POST',
        body,
    });

export const getCreateEnrichmentRequest = (
    state: UserState,
    body: RequestProps['body'],
) =>
    getRequest(state, {
        url: '/api/enrichment',
        method: 'POST',
        body,
    });

export const getPreviewDataEnrichmentRequest = (
    state: UserState,
    body: RequestProps['body'],
) =>
    getRequest(state, {
        url: '/api/enrichment/preview',
        method: 'POST',
        body,
    });

export const getUpdateEnrichmentRequest = (
    state: UserState,
    enrichment: {
        _id: string;
    },
) =>
    getRequest(state, {
        url: `/api/enrichment/${enrichment._id}`,
        method: 'PUT',
        body: enrichment,
    });

export const getDeleteEnrichmentRequest = (state: UserState, id: string) =>
    getRequest(state, {
        url: `/api/enrichment/${id}`,
        method: 'DELETE',
    });

export const getConfigTenantAvailableThemeRequest = (state: UserState) =>
    getRequest(state, {
        url: '/api/themes',
        method: 'GET',
    });

export const getConfigTenantRequest = (state: UserState) =>
    getRequest(state, {
        url: `/api/config-tenant`,
        method: 'GET',
    });

// @ts-expect-error TS7006
export const getUpdateConfigTenantRequest = (state: UserState, configTenant) =>
    getRequest(state, {
        url: `/api/config-tenant/${configTenant._id}`,
        method: 'PUT',
        body: configTenant,
    });

export const getLoadPrecomputedRequest = (state: UserState) =>
    getRequest(state, {
        url: '/api/precomputed',
    });

// @ts-expect-error TS7006
export const getPrecomputedActionRequest = (state: UserState, { action, id }) =>
    getRequest(state, {
        url: `/api/precomputed/${action}/${id}`,
        method: 'POST',
    });

// @ts-expect-error TS7006
export const getCreatePrecomputedRequest = (state: UserState, body) =>
    getRequest(state, {
        url: '/api/precomputed',
        method: 'POST',
        body,
    });

// @ts-expect-error TS7006
export const getPreviewDataPrecomputedRequest = (state: UserState, body) =>
    getRequest(state, {
        url: '/api/precomputed/preview',
        method: 'POST',
        body,
    });

// @ts-expect-error TS7006
export const getUpdatePrecomputedRequest = (state: UserState, precomputed) =>
    getRequest(state, {
        url: `/api/precomputed/${precomputed._id}`,
        method: 'PUT',
        body: precomputed,
    });

// @ts-expect-error TS7006
export const getDeletePrecomputedRequest = (state: UserState, id) =>
    getRequest(state, {
        url: `/api/precomputed/${id}`,
        method: 'DELETE',
    });

export const getUpdateSubresourceRequest = (
    state: UserState,
    { _id, ...body }: { _id: string; [key: string]: unknown },
) =>
    getRequest(state, {
        url: `/api/subresource/${_id}`,
        method: 'PUT',
        body,
    });

export const getDeleteSubresourceRequest = (state: UserState, id: string) =>
    getRequest(state, {
        url: `/api/subresource/${id}`,
        method: 'DELETE',
    });

export const getLoadFieldRequest = (state: UserState) =>
    getRequest(state, {
        url: '/api/field',
    });

export const getCreateFieldRequest = (
    state: UserState,
    fieldData: RequestProps['body'],
) =>
    getRequest(state, {
        url: '/api/field',
        body: fieldData,
        method: 'POST',
    });

export const getUpdateFieldRequest = (
    state: UserState,
    { _id, ...fieldData }: { _id?: string; [key: string]: unknown },
) =>
    getRequest(state, {
        url: `/api/field/${_id}`,
        body: fieldData,
        method: 'PATCH',
    });

export const getPatchSearchableFieldsRequest = (
    state: UserState,
    fieldsData: RequestProps['body'],
) =>
    getRequest(state, {
        url: `/api/field/searchable`,
        body: fieldsData,
        method: 'PATCH',
    });

export const getPatchOverviewRequest = (
    state: UserState,
    fieldData: RequestProps['body'],
) =>
    getRequest(state, {
        url: `/api/field/overview`,
        body: fieldData,
        method: 'PATCH',
    });

export const getPatchSortFieldRequest = (
    state: UserState,
    body: RequestProps['body'],
) =>
    getRequest(state, {
        url: `/api/field/sort-field`,
        body,
        method: 'PATCH',
    });

export const getPatchSortOrderRequest = (
    state: UserState,
    body: RequestProps['body'],
) =>
    getRequest(state, {
        url: `/api/field/sort-order`,
        body,
        method: 'PATCH',
    });

export const getSaveFieldRequest = (
    state: UserState,
    fieldData: { name: string; _id?: string; [key: string]: unknown },
) => {
    if (fieldData.name === 'new') {
        return getCreateFieldRequest(state, omit(fieldData, ['name']));
    }

    return getUpdateFieldRequest(state, fieldData);
};

export const getRemoveFieldRequest = (
    state: UserState,
    {
        _id,
    }: {
        _id: string;
    },
) =>
    getRequest(state, {
        url: `/api/field/${_id}`,
        method: 'DELETE',
    });

export const getLoadParsingResultRequest = (state: UserState) =>
    getRequest(state, {
        url: '/api/parsing',
    });

export const getPublishRequest = (state: UserState) =>
    getRequest(state, {
        url: '/api/publish',
        method: 'POST',
    });

export const getClearPublishedRequest = (state: UserState) =>
    getRequest(state, {
        url: '/api/publish',
        method: 'DELETE',
    });

export const getLoadRemovedResourcePageRequest = (
    state: UserState,
    {
        page,
        perPage,
    }: {
        page: number;
        perPage: number;
    },
) =>
    getRequest(state, {
        url: `/api/publishedDataset/removed?page=${encodeURIComponent(
            page,
        )}&perPage=${encodeURIComponent(perPage)}`,
    });

export const getRestoreResourceRequest = (state: UserState, uri: string) =>
    getRequest(state, {
        url: '/api/publishedDataset/restore',
        body: { uri },
        method: 'PUT',
    });

export const getUpdateCharacteristicsRequest = (
    state: UserState,
    newCharacteristics: Record<string, unknown>,
) =>
    getRequest(state, {
        url: '/api/characteristic',
        method: 'PUT',
        body: newCharacteristics,
    });

export const getAddCharacteristicRequest = (
    state: UserState,
    newCharacteristics: Record<string, unknown>,
) =>
    getRequest(state, {
        url: '/api/characteristic',
        method: 'POST',
        body: newCharacteristics,
    });

export const getLoadDatasetPageRequest = (state: UserState, params = {}) => {
    return getRequest(state, {
        url: `/api/publishedDataset`,
        method: 'POST',
        body: params,
    });
};

export const getLoadPublicationRequest = (state: UserState) =>
    getRequest(state, {
        url: '/api/publication',
    });

export const getLoadResourceRequest = (state: UserState, uri: string) =>
    getRequest(state, {
        url: `/api/publishedDataset/ark?uri=${encodeURIComponent(
            uri,
        )}&applyFormat=true`,
    });

export const getSaveResourceRequest = (
    state: UserState,
    {
        resource,
        field,
    }: {
        resource: string;
        field: string;
    },
) =>
    getRequest(state, {
        url: '/api/publishedDataset',
        method: 'PUT',
        body: {
            resource,
            field,
        },
    });

export const getHideResourceRequest = (
    state: UserState,
    data: Record<string, unknown>,
) =>
    getRequest(state, {
        url: '/api/publishedDataset',
        method: 'DELETE',
        body: data,
    });

export const getGetDatasetRequest = (
    state: UserState,
    params: Record<string, unknown>,
) => {
    const paramString = getQueryString(params);
    return getRequest(state, {
        url: `/api/dataset?${paramString}`,
        method: 'GET',
    });
};
export const getGetPrecomputedResultListRequest = ({
    state,
    precomputedId,
    params,
}: {
    state: UserState;
    precomputedId: string;
    params: Record<string, unknown>;
}) => {
    const paramString = getQueryString(params);
    return getRequest(state, {
        url: `/api/precomputed/${precomputedId}/result?${paramString}`,
        method: 'GET',
    });
};

export const putUpdateDataset = (
    state: UserState,
    data: Record<string, unknown>,
) =>
    getRequest(state, {
        url: '/api/dataset',
        method: 'PUT',
        body: data,
    });

export const putUpdatePrecomputedResult = ({
    state,
    precomputedId,
    id,
    data,
}: {
    state: UserState;
    precomputedId: string;
    id: string;
    data: Record<string, unknown>;
}) =>
    getRequest(state, {
        url: `/api/precomputed/${precomputedId}/result/${id}`,
        method: 'PUT',
        body: data,
    });

export const getGetDatasetColumnsRequest = (state: UserState) => {
    return getRequest(state, {
        url: `/api/dataset/columns`,
        method: 'GET',
    });
};

export const getGetPrecomputedResultColumnsRequest = (
    state: UserState,
    precomputedId: string,
) => {
    return getRequest(state, {
        url: `/api/precomputed/${precomputedId}/result/columns`,
        method: 'GET',
    });
};

export const getDeleteManyDatasetRowRequest = (
    state: UserState,
    ids: string[],
) => {
    return getRequest(state, {
        url: `/api/dataset/batch-delete-id?ids=${encodeURIComponent(ids.join(','))}`,
        method: 'DELETE',
    });
};

export const getDeleteFilteredDatasetRowRequest = (
    state: UserState,
    {
        columnField,
        operatorValue,
        value,
    }: {
        columnField: string;
        operatorValue: string;
        value: string;
    },
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

export const getClearDatasetRequest = (state: UserState) =>
    getRequest(state, {
        url: '/api/dataset',
        method: 'DELETE',
    });

export const getDumpDatasetRequest = (state: UserState, fields: string[]) => {
    const searchParams = new URLSearchParams();
    fields.forEach((field: string) => searchParams.append('fields[]', field));
    return getRequest(state, {
        url: `/api/dump?${searchParams.toString()}`,
        method: 'GET',
    });
};

export const getAddFieldToResourceRequest = (
    state: UserState,
    data: Record<string, unknown>,
) =>
    getRequest(state, {
        url: '/api/publishedDataset/add_field',
        method: 'PUT',
        body: data,
    });

export const getCreateResourceRequest = (
    state: UserState,
    data: Record<string, unknown>,
) =>
    getRequest(state, {
        url: '/api/publishedDataset',
        method: 'POST',
        body: data,
    });

export const getExportFieldsRequest = (state: UserState) =>
    getRequest(state, {
        url: '/api/field/export',
    });

export const getExportFieldsReadyRequest = (state: UserState) =>
    getRequest(state, {
        url: '/api/field/export/ready',
    });

export const getLoadFacetValuesRequest = (
    state: UserState,
    {
        field,
        filter,
        currentPage = 0,
        perPage = 10,
        sort = {},
    }: {
        field: string;
        filter?: string;
        currentPage?: number;
        perPage?: number;
        sort?: Record<string, unknown>;
    },
) =>
    getRequest(state, {
        url: `/api/facet/${field}/${filter || ''}?${getQueryString({
            page: currentPage,
            perPage,
            sort,
        })}`,
    });

export const getChangeFieldStatusRequest = (
    state: UserState,
    {
        uri,
        field,
        status,
    }: {
        uri: string;
        field: string;
        status: string;
    },
) =>
    getRequest(state, {
        method: 'PUT',
        url: `/api/publishedDataset/${encodeURIComponent(
            uri,
        )}/change_contribution_status/${field}/${status}`,
    });

export const getLoadExportersRequest = (state: UserState) =>
    getRequest(state, {
        url: '/api/export',
    });

export const getClearUploadRequest = (state: UserState) =>
    getRequest(state, {
        method: 'DELETE',
        url: '/api/upload/clear',
    });

export const getUploadUrlRequest = (
    state: UserState,
    {
        url,
        loaderName,
        customLoader = null,
    }: {
        url: string;
        loaderName: string;
        customLoader?: string | null;
    },
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
    state: UserState,
    {
        text,
        loaderName,
        customLoader = null,
    }: {
        text: string;
        loaderName: string;
        customLoader?: string | null;
    },
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

export const getUrlRequest = (
    state: UserState,
    {
        url,
        queryString,
    }: {
        url: string;
        queryString?: string;
    },
) =>
    getRequest(state, {
        method: 'GET',
        url: `${url}${queryString ? `?${queryString}` : ''}`,
    });

export const getSparqlRequest = (
    state: UserState,
    {
        url,
        body,
    }: {
        url: string;
        body: Record<string, unknown>;
    },
) => {
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

export const getIstexRequest = (
    state: UserState,
    {
        url,
    }: {
        url: string;
    },
) => {
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
    state: UserState,
    {
        type,
        queryString,
    }: {
        type: string;
        queryString: string;
    },
) =>
    getRequest(state, {
        method: 'GET',
        url: `/api/export/${type}?${queryString}`,
    });

// download pdf file
export const getExportPDFRequest = (
    state: UserState,
    options: Record<string, unknown>,
) => {
    const paramString = getQueryString(options);
    return getRequest(state, {
        method: 'GET',
        url: `/api/pdf?${paramString}`,
        head: {
            Accept: 'application/pdf',
        },
    });
};

export const getReorderFieldRequest = (
    state: UserState,
    fields: { name: string }[],
) =>
    getRequest(state, {
        method: 'PUT',
        url: '/api/field/reorder',
        body: {
            fields: fields.map(({ name }) => name),
        },
    });

export const getProgressRequest = (state: UserState) =>
    getRequest(state, {
        method: 'GET',
        url: '/api/progress',
    });

export const getBreadcrumbRequest = (state: UserState) =>
    getRequest(state, {
        method: 'GET',
        url: '/api/breadcrumb',
    });

export const getMenuRequest = (state: UserState) =>
    getRequest(state, {
        method: 'GET',
        url: '/api/menu',
    });

export const getDisplayConfigRequest = (state: UserState) =>
    getRequest(state, {
        method: 'GET',
        url: '/api/displayConfig',
    });

export const getLoadLoadersRequest = (state: UserState) =>
    getRequest(state, {
        url: '/api/loader',
    });

export const getJobLogsRequest = (state: UserState, jobId: string) =>
    getRequest(state, {
        url: `/api/job/${jobId}/logs`,
    });

export const getCancelJobRequest = (
    state: UserState,
    queue: string,
    subLabel: string,
) =>
    getRequest(state, {
        url: `/api/job/${queue}/cancel`,
        method: 'POST',
        body: { subLabel },
    });

export const getClearJobsRequest = (state: UserState) =>
    getRequest(state, {
        url: `/api/job/clear`,
        method: 'POST',
    });

export const getLoaderWithScriptRequest = (
    state: UserState,
    {
        name,
    }: {
        name: string;
    },
) =>
    getRequest(state, {
        method: 'GET',
        url: `/api/loader/${name}`,
    });

export const postDuplicateField = (
    state: UserState,
    data: Record<string, unknown>,
) =>
    getRequest(state, {
        url: '/api/field/duplicate',
        method: 'POST',
        body: data,
    });

export const clearModelRequest = (state: UserState) =>
    getRequest(state, {
        url: '/api/field',
        method: 'DELETE',
    });

export const getThemeRequest = (state: UserState) =>
    getRequest(state, {
        url: '/api/themes/current',
        method: 'GET',
    });

export const getExportPrecomputedDataRequest = (
    state: UserState,
    id: string,
) => {
    return getRequest(state, {
        method: 'GET',
        url: `/api/precomputed/${id}/download`,
        head: {
            Accept: 'application/json',
        },
    });
};

export const getPreviewPrecomputedDataRequest = (
    state: UserState,
    id: string,
) => {
    return getRequest(state, {
        method: 'GET',
        url: `/api/precomputed/${id}/previewData`,
        head: {
            Accept: 'application/json',
        },
    });
};

export const getExportHiddenResources = (state: UserState) => {
    return getRequest(state, {
        url: '/api/hiddenResource/export',
        method: 'GET',
        head: {
            Accept: 'application/json',
        },
    });
};

export const getImportHiddenResources = (
    state: UserState,
    formData: string,
) => {
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
