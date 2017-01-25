import { takeLatest } from 'redux-saga';
import { call, fork, put, select } from 'redux-saga/effects';

import { PUBLISH, publishSuccess, publishError } from './';
import { getToken } from '../../user';

export const fetchPublish = token => fetch('/api/publish', {
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

export function* handlePublishRequest() {
    const token = yield select(getToken);

    try {
        yield call(fetchPublish, token);
        yield put(publishSuccess());
    } catch (error) {
        yield put(publishError(error));
    }
}

export function* watchPublishRequest() {
    yield takeLatest(PUBLISH, handlePublishRequest);
}

export default function* () {
    yield fork(watchPublishRequest);
}
