import { call, put, select, takeLatest, fork } from 'redux-saga/effects';

import {
    LOAD_SUBRESOURCES,
    CREATE_SUBRESOURCE,
    loadSubresourcesSuccess,
    loadSubresourcesError,
    loadSubresources,
    UPDATE_SUBRESOURCE,
    createSubresourceOptimistic,
    updateSubresourceOptimistic,
} from '.';

import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export function* handleLoadSubresourcesRequest() {
    const request = yield select(fromUser.getLoadSubresourcesRequest);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadSubresourcesError(error));
    }

    return yield put(loadSubresourcesSuccess(response));
}

export function* handleCreateSubresource({ payload: { resource, callback } }) {
    const request = yield select(
        fromUser.getCreateSubresourceRequest,
        resource,
    );
    const { error, response } = yield call(fetchSaga, request);
    if (error) {
        return;
    }

    yield put(createSubresourceOptimistic(response));

    if (callback) {
        callback(response._id);
    }

    return yield put(loadSubresources());
}

export function* handleUpdateSubresource({ payload: resource }) {
    const request = yield select(
        fromUser.getUpdateSubresourceRequest,
        resource,
    );
    const { error, response } = yield call(fetchSaga, request);
    if (error) {
        return;
    }

    yield put(updateSubresourceOptimistic(response));

    return yield put(loadSubresources());
}

export function* watchLoadResourcesRequest() {
    yield takeLatest(LOAD_SUBRESOURCES, handleLoadSubresourcesRequest);
}

export function* watchCreateResource() {
    yield takeLatest(CREATE_SUBRESOURCE, handleCreateSubresource);
}

export function* watchUpdateResource() {
    yield takeLatest(UPDATE_SUBRESOURCE, handleUpdateSubresource);
}

export default function*() {
    yield fork(watchLoadResourcesRequest);
    yield fork(watchCreateResource);
    yield fork(watchUpdateResource);
}
