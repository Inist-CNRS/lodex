import { call, fork, put, select, takeLatest } from 'redux-saga/effects';

import {
    LOAD_PUBLICATION,
    loadPublicationSuccess,
    loadPublicationError,
} from './';
import { PUBLISH_SUCCESS } from '../publish';
import { getLoadPublicationRequest } from '../../fetch';
import fetchSaga from '../../lib/sagas/fetchSaga';

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
