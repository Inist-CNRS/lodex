import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    LOAD_CONTRIBUTED_RESOURCE_PAGE,
    CHANGE_CONTRIBUTED_RESOURCE_FILTER,
    loadContributedResourcePageSuccess,
    loadContributedResourcePageError,
} from './';
import fetchSaga from '../../lib/sagas/fetchSaga';
import { getLoadContributedResourcePageRequest } from '../../fetch/';
import { fromContributedResources } from '../selectors';

export function* handleLoadContributedResourcePageRequest() {
    const data = yield select(fromContributedResources.getRequestData);
    const request = yield select(getLoadContributedResourcePageRequest, data);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadContributedResourcePageError(error));
    }

    const { data: resources, total } = response;
    return yield put(loadContributedResourcePageSuccess({ resources, page: data.page, total }));
}

export default function* () {
    yield takeLatest([
        LOAD_CONTRIBUTED_RESOURCE_PAGE,
        CHANGE_CONTRIBUTED_RESOURCE_FILTER,
    ], handleLoadContributedResourcePageRequest);
}
