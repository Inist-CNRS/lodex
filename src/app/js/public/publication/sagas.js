import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import {
    LOAD_PUBLICATION,
    loadPublicationSuccess,
    loadPublicationError,
} from './';
import { PUBLISH_SUCCESS } from '../../admin/publish';
import { getLoadPublicationRequest } from '../../fetch';
import fetchSaga from '../../lib/fetchSaga';

export function* handleLoadPublicationRequest() {
    const request = yield select(getLoadPublicationRequest);

    const { error, response: publication } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadPublicationError(error));
    }

    return yield put(loadPublicationSuccess(publication));
}

export default function* watchLoadPublicationRequest() {
    yield takeLatest([LOAD_PUBLICATION, PUBLISH_SUCCESS], handleLoadPublicationRequest);
}
