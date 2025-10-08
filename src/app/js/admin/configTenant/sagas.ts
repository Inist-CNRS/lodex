import { call, put, select, takeLatest, fork } from 'redux-saga/effects';

import {
    LOAD_CONFIG_TENANT,
    loadConfigTenantError,
    loadConfigTenantSuccess,
} from '.';

import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export function* handleLoadConfigTenantRequest() {
    // @ts-expect-error TS7057
    const request = yield select(fromUser.getConfigTenantRequest);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        // @ts-expect-error TS7057
        return yield put(loadConfigTenantError(error));
    }

    // @ts-expect-error TS7057
    return yield put(loadConfigTenantSuccess(response));
}

export function* watchLoadConfigTenantRequest() {
    yield takeLatest([LOAD_CONFIG_TENANT], handleLoadConfigTenantRequest);
}

export default function* () {
    yield fork(watchLoadConfigTenantRequest);
}
