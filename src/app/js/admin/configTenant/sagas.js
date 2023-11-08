import { call, put, select, takeLatest, fork } from 'redux-saga/effects';

import {
    LOAD_CONFIG_TENANT,
    loadConfigTenantError,
    loadConfigTenantSuccess,
} from '.';

import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export function* handleLoadEnrichmentsRequest() {
    const request = yield select(fromUser.getConfigTenantRequest);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadConfigTenantError(error));
    }

    return yield put(loadConfigTenantSuccess(response));
}

export function* watchLoadConfigTenantRequest() {
    yield takeLatest([LOAD_CONFIG_TENANT], handleLoadEnrichmentsRequest);
}

export default function*() {
    yield fork(watchLoadConfigTenantRequest);
}
