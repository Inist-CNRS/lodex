import { call, fork, put, select, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import fetchSaga from '../../lib/sagas/fetchSaga';

import {
    LOAD_PARSING_RESULT,
    loadParsingResultError,
    loadParsingResultSuccess,
} from './';
import { UPLOAD_SUCCESS } from '../upload';
import { fromUser } from '../../sharedSelectors';
import { INDEXATION, STARTING } from '../../../../common/progressStatus';
import {
    clearProgress,
    finishProgress,
    updateProgress,
} from '../progress/reducer';

export function* handleLoadParsingResult(action) {
    const request = yield select(fromUser.getLoadParsingResultRequest);

    if (action.type === UPLOAD_SUCCESS) {
        yield put(updateProgress({ status: INDEXATION }));
        // MongoDB needs extra time to compute large datasets
        yield call(delay, 5000);
        yield put(clearProgress());
    }

    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadParsingResultError(error));
    }

    return yield put(loadParsingResultSuccess(response));
}

export function* watchLoadParsingResult() {
    yield takeLatest(
        [LOAD_PARSING_RESULT, UPLOAD_SUCCESS],
        handleLoadParsingResult,
    );
}

export default function*() {
    yield fork(watchLoadParsingResult);
}
