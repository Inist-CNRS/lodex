import { call, fork, put, select, takeLatest } from 'redux-saga/effects';
import characteristicSaga from './characteristic/sagas';
import datasetSaga from './dataset/sagas';
import resourceSagas from './resource/sagas';

import {
    LOAD_PUBLICATION,
    loadPublicationSuccess,
    loadPublicationError,
} from './';
import { PUBLISH_SUCCESS } from '../admin/publish';
import { getLoadPublicationRequest } from '../fetch';
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
    yield fork(characteristicSaga);
    yield fork(datasetSaga);
    yield fork(resourceSagas);
}
