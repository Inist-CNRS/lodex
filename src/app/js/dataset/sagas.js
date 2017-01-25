import { takeLatest } from 'redux-saga';
import { call, fork, put, select } from 'redux-saga/effects';

import {
    LOAD_DATASET_PAGE,
    loadDatasetPageSuccess,
    loadDatasetPageError,
} from './';
import { getToken } from '../user';

export const fetchDataset = (token, page = 0, perPage = 20) => {
    const { host, protocol } = window.location;
    const url = new URL(`${protocol}//${host}/api/publishedDataset`);
    url.searchParams.append('page', page);
    url.searchParams.append('perPage', perPage);

    return fetch(url, {
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        if (response.status >= 200 && response.status < 300) return response;
        throw new Error(response.statusText);
    }).then(response => response.json());
};

export function* handleLoadDatasetPageRequest({ payload: { page, perPage } }) {
    const token = yield select(getToken);

    try {
        const { data: dataset, total } = yield call(fetchDataset, token, page, perPage);
        yield put(loadDatasetPageSuccess({ dataset, page, total }));
    } catch (error) {
        yield put(loadDatasetPageError(error));
    }
}

export function* watchLoadDatasetPageRequest() {
    yield takeLatest(LOAD_DATASET_PAGE, handleLoadDatasetPageRequest);
}

export default function* () {
    yield fork(watchLoadDatasetPageRequest);
}
