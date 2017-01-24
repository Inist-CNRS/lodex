import { takeLatest } from 'redux-saga';
import { call, fork, put, select } from 'redux-saga/effects';

import {
    LOAD_PARSING_RESULT,
    loadParsingResultError,
    loadParsingResultSuccess,
} from './';
import { getToken } from '../../user';

export const fetchParsingResult = token => fetch('/api/parsing', {
    credentials: 'include',
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
}).then((response) => {
    if (response.status >= 200 && response.status < 300) return response;
    throw new Error(response.statusText);
}).then(response => response.json());

export function* handleLoadParsingResult() {
    const token = yield select(getToken);

    try {
        const result = yield call(fetchParsingResult, token);
        yield put(loadParsingResultSuccess(result));
    } catch (error) {
        yield put(loadParsingResultError(error));
    }
}

export function* watchLoadParsingResult() {
    yield takeLatest(LOAD_PARSING_RESULT, handleLoadParsingResult);
}

export default function* () {
    yield fork(watchLoadParsingResult);
}
