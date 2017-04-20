import { call, fork, put, select, takeLatest } from 'redux-saga/effects';

import fetchSaga from '../../lib/sagas/fetchSaga';

import {
    LOAD_PARSING_RESULT,
    loadParsingResultError,
    loadParsingResultSuccess,
} from './';
import { UPLOAD_FILE_SUCCESS } from '../upload';
import { getLoadParsingResultRequest } from '../../fetch/';

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
