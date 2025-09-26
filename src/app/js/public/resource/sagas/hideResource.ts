import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    hideResourceSuccess,
    hideResourceError,
    getHideResourceFormData,
    HIDE_RESOURCE,
} from '../';
import { fromUser } from '../../../sharedSelectors';
import fetchSaga from '../../../lib/sagas/fetchSaga';

// @ts-expect-error TS7031
export function* handleHideResource({ payload: uri }) {
    const { reason } = yield select(getHideResourceFormData);
    // @ts-expect-error TS7057
    const request = yield select(fromUser.getHideResourceRequest, {
        uri,
        reason,
    });
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(hideResourceError(error));
        return;
    }

    yield put(hideResourceSuccess(response));
}

export default function* watchHideResource() {
    // @ts-expect-error TS2769
    yield takeLatest(HIDE_RESOURCE, handleHideResource);
}
