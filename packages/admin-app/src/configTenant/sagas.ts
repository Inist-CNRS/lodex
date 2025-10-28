import { call, put, select, takeLatest, fork } from 'redux-saga/effects';

import {
    LOAD_CONFIG_TENANT,
    loadConfigTenantError,
    loadConfigTenantSuccess,
} from './index';

import { fromUser } from '../../../../src/app/js/sharedSelectors';
import fetchSaga from '../../../../src/app/js/lib/sagas/fetchSaga';

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
