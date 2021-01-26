import { call, put, take, race, select, takeLatest } from 'redux-saga/effects';

import {
    PUBLISH,
    PUBLISH_CONFIRM,
    PUBLISH_CANCEL,
    publishSuccess,
    publishError,
    publishWarn,
} from './';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import { FINISH_PROGRESS, ERROR_PROGRESS } from '../progress/reducer';

export function* handlePublishRequest() {
    const verifyUriRequest = yield select(fromUser.getVerifyUriRequest);
    const verifyResponse = yield call(fetchSaga, verifyUriRequest);

    const {
        error: verifyError,
        response: { nbInvalidUri, nbInvalidSubresourceUriMap },
    } = verifyResponse;

    if (verifyError) {
        yield put(publishError(verifyError));
        return;
    }

    const countInvalidSubresourceUri = nbInvalidSubresourceUriMap
        ? Object.keys(nbInvalidSubresourceUriMap).length
        : 0;

    const needWarn = nbInvalidUri > 0 || countInvalidSubresourceUri > 0;

    if (needWarn) {
        yield put(publishWarn({ nbInvalidUri, nbInvalidSubresourceUriMap }));
        const { cancel } = yield race({
            cancel: take(PUBLISH_CANCEL),
            ok: take(PUBLISH_CONFIRM),
        });

        if (cancel) {
            return;
        }
    }

    const request = yield select(fromUser.getPublishRequest);
    const { error } = yield call(fetchSaga, request);

    if (error) {
        yield put(publishError(error));
        return;
    } else if (needWarn) {
        yield put(publishSuccess());
    }

    const { progressError } = yield race({
        progressFinish: take(FINISH_PROGRESS),
        progressError: take(ERROR_PROGRESS),
    });

    if (progressError) {
        yield put(publishError(progressError.payload.error));
        return;
    }

    yield put(publishSuccess());
}

export default function*() {
    yield takeLatest(PUBLISH, handlePublishRequest);
}
