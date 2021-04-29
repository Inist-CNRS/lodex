import { call, fork, put, select, takeLatest } from 'redux-saga/effects';

import {
    LOAD_PUBLICATION,
    loadPublicationSuccess,
    loadPublicationError,
    computePublication,
} from './';
import { PUBLISH_SUCCESS } from '../publish';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export function* handleLoadPublicationRequest({ payload }) {
    const request = yield select(fromUser.getLoadPublicationRequest);

    const { error, response: publication } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadPublicationError(error));
    }

    yield put(loadPublicationSuccess(publication));

    if (payload && payload.forcePostComputation) {
        yield put(computePublication());
    }
}

export function* watchLoadPublicationRequest() {
    yield takeLatest(
        [LOAD_PUBLICATION, PUBLISH_SUCCESS],
        handleLoadPublicationRequest,
    );
}

export default function*() {
    yield fork(watchLoadPublicationRequest);
}
