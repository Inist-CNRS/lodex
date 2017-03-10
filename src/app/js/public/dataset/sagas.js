import { call, put, select, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import {
    LOAD_DATASET_PAGE,
    FILTER_DATASET,
    loadDatasetPageSuccess,
    loadDatasetPageError,
} from './';
import { getLoadDatasetPageRequest } from '../../fetch/';
import fetchSaga from '../../lib/fetchSaga';

export function* handleLoadDatasetPageRequest({ payload }) {
    const request = yield select(getLoadDatasetPageRequest, payload);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadDatasetPageError(error));
    }

    const { data: dataset, total } = response;
    yield delay(500);

    return yield put(loadDatasetPageSuccess({ dataset, page: payload.page, total }));
}

export default function* () {
    yield takeLatest([LOAD_DATASET_PAGE, FILTER_DATASET], handleLoadDatasetPageRequest);
}
