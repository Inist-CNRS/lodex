import { takeLatest } from 'redux-saga';
import { call, fork, put, select } from 'redux-saga/effects';

import {
    LOAD_PUBLICATION,
    getLoadPublicationRequest,
    loadPublicationSuccess,
    loadPublicationError,
} from './';
import { PUBLISH_SUCCESS } from '../admin/publish';
import fetchSaga from '../lib/fetchSaga';

export function* handleLoadPublicationRequest() {
    const request = yield select(getLoadPublicationRequest);

    const { error, response: publication } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadPublicationError(error));
    }

    return yield put(loadPublicationSuccess(publication));
}

export function* watchLoadPublicationRequest() {
    yield takeLatest([LOAD_PUBLICATION, PUBLISH_SUCCESS], handleLoadPublicationRequest);
}

export default function* () {
    yield fork(watchLoadPublicationRequest);
}
