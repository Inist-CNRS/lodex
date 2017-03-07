import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    LOAD_CONTRIBUTED_RESOURCE_PAGE,
    loadContributedResourcePageSuccess,
    loadContributedResourcePageError,
} from './';
import fetchSaga from '../../lib/fetchSaga';
import { getLoadContributedResourcePageRequest } from '../../fetch/';

export function* handleLoadContributedResourcePageRequest({ payload }) {
    const request = yield select(getLoadContributedResourcePageRequest, payload);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadContributedResourcePageError(error));
    }

    const { data: resources, total } = response;
    return yield put(loadContributedResourcePageSuccess({ resources, page: payload.page, total }));
}

export default function* () {
    yield takeLatest(LOAD_CONTRIBUTED_RESOURCE_PAGE, handleLoadContributedResourcePageRequest);
}
