import fetch from '@lodex/frontend-common/fetch/fetch';
import {
    getGetDatasetRequest,
    getGetDatasetColumnsRequest,
    putUpdateDataset,
    getDeleteManyDatasetRowRequest,
    getDeleteFilteredDatasetRowRequest,
    getGetPrecomputedResultListRequest,
    getGetPrecomputedResultColumnsRequest,
    putUpdatePrecomputedResult,
} from '@lodex/frontend-common/user/reducer';
import { getUserSessionStorageInfo } from '@lodex/frontend-common/getUserSessionStorageInfo';

const getData = async ({
    precomputedId,
    filter,
    skip,
    limit,
    sort,
}: {
    precomputedId?: string;
    filter?: {
        field: string;
        operator: string;
        value: string;
    };
    skip?: number;
    limit?: number;
    sort?: {
        sortBy?: string;
        sortDir?: string;
    };
}) => {
    const { token } = getUserSessionStorageInfo();

    const request = precomputedId
        ? getGetPrecomputedResultListRequest({
              state: {
                  token,
              },
              precomputedId,
              params: {
                  filter,
                  skip,
                  limit,
                  sort,
              },
          })
        : getGetDatasetRequest({ token }, { filter, skip, limit, sort });
    // @ts-expect-error TS7031
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return [];
        }
        return response;
    });
};

const getDataset = async (params: {
    filter?: {
        field: string;
        operator: string;
        value: string;
    };
    skip?: number;
    limit?: number;
    sort?: {
        sortBy?: string;
        sortDir?: string;
    };
}) => {
    return getData(params);
};

const getDataColumns = async (precomputedId?: string) => {
    const { token } = getUserSessionStorageInfo();

    const request = precomputedId
        ? getGetPrecomputedResultColumnsRequest({ token }, precomputedId)
        : getGetDatasetColumnsRequest({ token });
    // @ts-expect-error TS7031
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return { columns: [] };
        }
        return response;
    });
};

const getDatasetColumns = async () => {
    return getDataColumns();
};

const updateData = async ({
    precomputedId,
    row,
    field,
    value,
}: {
    precomputedId?: string;
    row: { uri?: string; _id?: string };
    field: string;
    value: unknown;
}) => {
    const { token } = getUserSessionStorageInfo();

    const request = precomputedId
        ? putUpdatePrecomputedResult({
              state: {
                  token,
              },
              precomputedId,
              id: row._id!,
              data: { [field]: value },
          })
        : putUpdateDataset({ token }, { uri: row.uri!, field, value });
    // @ts-expect-error TS7031
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return [];
        }
        return response;
    });
};

export const updateDataset = async ({
    uri,
    field,
    value,
}: {
    uri: string;
    field: string;
    value: unknown;
}) => {
    return updateData({ row: { uri }, field, value });
};

// @ts-expect-error TS7006
const deleteManyDatasetRows = async (ids) => {
    const { token } = getUserSessionStorageInfo();

    const request = getDeleteManyDatasetRowRequest({ token }, ids);
    // @ts-expect-error TS7031
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return [];
        }
        return response;
    });
};

// @ts-expect-error TS7006
const deleteFilteredDatasetRows = async (filter) => {
    const { token } = getUserSessionStorageInfo();

    const request = getDeleteFilteredDatasetRowRequest({ token }, filter);
    // @ts-expect-error TS7031
    return fetch(request).then(({ response, error }) => {
        if (error) {
            return [];
        }
        return response;
    });
};

export default {
    getDataset,
    getData,
    getDatasetColumns,
    getDataColumns,
    updateDataset,
    updateData,
    deleteManyDatasetRows,
    deleteFilteredDatasetRows,
};
