import { takeLatest } from 'redux-saga';
import { call, fork, put, select } from 'redux-saga/effects';

import {
    LOAD_DATASET_PAGE,
    getLoadDatasetPageRequest,
    loadDatasetPageSuccess,
    loadDatasetPageError,
} from './';
import fetchSaga from '../lib/fetchSaga';

export function* handleLoadDatasetPageRequest({ payload }) {
    const request = yield select(getLoadDatasetPageRequest, payload);

    try {
        const { error, response } = yield call(fetchSaga, request);

        if (error) {
            return yield put(loadDatasetPageError(error));
        }
        const { data: dataset, total } = response;

        return yield put(loadDatasetPageSuccess({ dataset, page: payload.page, total }));
    } catch (error) {
        return yield put(loadDatasetPageError(error));
    }
}

export function* watchLoadDatasetPageRequest() {
    yield takeLatest(LOAD_DATASET_PAGE, handleLoadDatasetPageRequest);
}

export default function* () {
    yield fork(watchLoadDatasetPageRequest);
}
