import { call, fork, put, take, race, select, takeLatest } from 'redux-saga/effects';

import {
    PUBLISH,
    PUBLISH_CONFIRM,
    PUBLISH_CANCEL,
    publishSuccess,
    publishError,
    publishWarn,
} from './';
import { getPublishRequest, getVerifyUriRequest } from '../../fetch/';
import fetchSaga from '../../lib/fetchSaga';

export function* handlePublishRequest() {
    const verifyUriRequest = yield select(getVerifyUriRequest);

    const { error: verifyError, response: { nbInvalidUri } } = yield call(fetchSaga, verifyUriRequest);

    if (verifyError) {
        yield put(publishError(verifyError));
        return;
    }

    if (nbInvalidUri > 0) {
        yield put(publishWarn(nbInvalidUri));
        const { cancel } = yield race({
            cancel: take(PUBLISH_CANCEL),
            ok: take(PUBLISH_CONFIRM),
        });

        if (cancel) {
            return;
        }
    }

    const request = yield select(getPublishRequest);
    const { error } = yield call(fetchSaga, request);

    if (error) {
        yield put(publishError(error));
        return;
    }

    yield put(publishSuccess());
}

export function* watchPublishRequest() {
    yield takeLatest(PUBLISH, handlePublishRequest);
}

export default function* () {
    yield fork(watchPublishRequest);
}
