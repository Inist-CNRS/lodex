import { call, fork, put, select, takeLatest } from 'redux-saga/effects';

import fetchSaga from '../../lib/sagas/fetchSaga';

import {
    LOAD_PARSING_RESULT,
    loadParsingResultError,
    loadParsingResultSuccess,
} from './';
import { fromUser } from '../../sharedSelectors';

export function* handleLoadParsingResult() {
    // @ts-expect-error TS7057
    const request = yield select(fromUser.getLoadParsingResultRequest);

    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        // @ts-expect-error TS7057
        return yield put(loadParsingResultError(error));
    }
    // @ts-expect-error TS7057
    return yield put(loadParsingResultSuccess(response));
}

export function* watchLoadParsingResult() {
    yield takeLatest([LOAD_PARSING_RESULT], handleLoadParsingResult);
}

export default function* () {
    yield fork(watchLoadParsingResult);
}
