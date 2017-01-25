import { takeLatest } from 'redux-saga';
import { call, fork, put, select } from 'redux-saga/effects';

import {
    LOAD_PUBLICATION,
    loadPublicationSuccess,
    loadPublicationError,
} from './';
import { PUBLISH_SUCCESS } from '../admin/publish';
import { getToken } from '../user';

export const fetchPublication = token => fetch('/api/publication', {
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

export function* handleLoadPublicationRequest() {
    const token = yield select(getToken);

    try {
        const publication = yield call(fetchPublication, token);
        yield put(loadPublicationSuccess(publication));
    } catch (error) {
        yield put(loadPublicationError(error));
    }
}

export function* watchLoadPublicationRequest() {
    yield takeLatest([LOAD_PUBLICATION, PUBLISH_SUCCESS], handleLoadPublicationRequest);
}

export default function* () {
    yield fork(watchLoadPublicationRequest);
}
