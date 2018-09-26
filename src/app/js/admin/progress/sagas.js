import { takeEvery, call, select, put } from 'redux-saga/effects';

import {
    updateProgress,
    errorProgress,
    loadProgress,
    LOAD_PROGRESS,
} from './reducer';
import { PUBLISH } from '../publish';
import fetchSaga from '../../lib/sagas/fetchSaga';
import { fromUser } from '../../sharedSelectors';
import { PENDING } from '../../../../common/progressStatus';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

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
        return;
    }
    yield put(loadProgress());
}

export default function* progressSaga() {
    yield takeEvery([PUBLISH, LOAD_PROGRESS], handleStartProgressSaga);
}
