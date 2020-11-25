import { call, put, select, takeLatest, fork } from 'redux-saga/effects';

import {
    LOAD_SUBRESOURCES,
    CREATE_SUBRESOURCE,
    loadSubresourcesSuccess,
    loadSubresourcesError,
    loadSubresources,
    UPDATE_SUBRESOURCE,
    DELETE_SUBRESOURCE,
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

export function* handleDeleteSubresource({ payload: id }) {
    const request = yield select(fromUser.getDeleteSubresourceRequest, id);
    const { error } = yield call(fetchSaga, request);
    if (error) {
        return;
    }

    return yield put(loadSubresources());
}

export function* watchLoadSubresourcesRequest() {
    yield takeLatest(LOAD_SUBRESOURCES, handleLoadSubresourcesRequest);
}

export function* watchCreateSubresource() {
    yield takeLatest(CREATE_SUBRESOURCE, handleCreateSubresource);
}

export function* watchUpdateSubresource() {
    yield takeLatest(UPDATE_SUBRESOURCE, handleUpdateSubresource);
}

export function* watchDeleteSubresource() {
    yield takeLatest(DELETE_SUBRESOURCE, handleDeleteSubresource);
}

export default function*() {
    yield fork(watchLoadSubresourcesRequest);
    yield fork(watchCreateSubresource);
    yield fork(watchUpdateSubresource);
    yield fork(watchDeleteSubresource);
}
