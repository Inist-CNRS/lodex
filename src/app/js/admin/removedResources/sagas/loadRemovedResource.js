import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    LOAD_REMOVED_RESOURCE_PAGE,
    loadRemovedResourcePageSuccess,
    loadRemovedResourcePageError,
} from '../';
import fetchSaga from '../../../lib/fetchSaga';
import { getLoadRemovedResourcePageRequest } from '../../../fetch/';

export function* handleLoadRemovedResourcePageRequest({ payload }) {
    const request = yield select(getLoadRemovedResourcePageRequest, payload);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadRemovedResourcePageError(error));
    }

    const { data: resources, total } = response;
    return yield put(loadRemovedResourcePageSuccess({ resources, page: payload.page, total }));
}

export default function* () {
    yield takeLatest(LOAD_REMOVED_RESOURCE_PAGE, handleLoadRemovedResourcePageRequest);
}
