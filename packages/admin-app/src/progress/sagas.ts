import { takeEvery, call, select, put, delay } from 'redux-saga/effects';

import {
    updateProgress,
    errorProgress,
    loadProgress,
    LOAD_PROGRESS,
    finishProgress,
} from './reducer';
import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';
import { fromUser } from '../../../../src/app/js/sharedSelectors';
import { ProgressStatus } from '@lodex/common';
import { CLEAR_PUBLISHED } from '../clear';

export function* handleStartProgressSaga() {
    yield delay(1000);
    // @ts-expect-error TS7057
    const request = yield select(fromUser.getProgressRequest);
    const { error, response } = yield call(fetchSaga, request);
    if (error) {
        yield put(errorProgress(error));
        return;
    }
    yield put(updateProgress(response));

    if (response.status === ProgressStatus.PENDING) {
        yield put(finishProgress());
        return;
    }
    yield put(loadProgress());
}

export default function* progressSaga() {
    yield takeEvery([LOAD_PROGRESS, CLEAR_PUBLISHED], handleStartProgressSaga);
}
