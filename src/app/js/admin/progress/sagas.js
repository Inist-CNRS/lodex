import { takeEvery, call, select, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import {
    updateProgress,
    errorProgress,
    loadProgress,
    LOAD_PROGRESS,
    finishProgress,
} from './reducer';
import { PUBLISH } from '../publish';
import { UPLOAD_FILE } from '../upload';
import fetchSaga from '../../lib/sagas/fetchSaga';
import { fromUser } from '../../sharedSelectors';
import { PENDING } from '../../../../common/progressStatus';

export function* handleStartProgressSaga() {
    yield delay(1000);
    const request = yield select(fromUser.getProgressRequest);
    const { error, response } = yield call(fetchSaga, request);
    if (error) {
        yield put(errorProgress(error));
        return;
    }

    yield put(updateProgress(response));

    if (response.status === PENDING) {
        yield put(finishProgress());
        return;
    }
    yield put(loadProgress());
}

export default function* progressSaga() {
    yield takeEvery(
        [PUBLISH, LOAD_PROGRESS, UPLOAD_FILE],
        handleStartProgressSaga,
    );
}
