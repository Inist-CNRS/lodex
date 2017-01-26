import { takeLatest } from 'redux-saga';
import { call, fork, put, select } from 'redux-saga/effects';

import fetchSaga from '../../lib/fetchSaga';

import {
    LOAD_PARSING_RESULT,
    getLoadParsingResultRequest,
    loadParsingResultError,
    loadParsingResultSuccess,
} from './';
import { UPLOAD_FILE_SUCCESS } from '../upload';

export function* handleLoadParsingResult() {
    const request = yield select(getLoadParsingResultRequest);

    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadParsingResultError(error));
    }

    return yield put(loadParsingResultSuccess(response));
}

export function* watchLoadParsingResult() {
    yield takeLatest([LOAD_PARSING_RESULT, UPLOAD_FILE_SUCCESS], handleLoadParsingResult);
}

export default function* () {
    yield fork(watchLoadParsingResult);
}
