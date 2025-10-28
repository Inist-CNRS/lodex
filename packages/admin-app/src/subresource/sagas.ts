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
} from './index';

import { fromUser } from '../../../../src/app/js/sharedSelectors';
import fetchSaga from '../../../../src/app/js/lib/sagas/fetchSaga';
import { loadPublication } from '../publication';
import { IMPORT_FIELDS_SUCCESS } from '../import';

export function* handleLoadSubresourcesRequest() {
    // @ts-expect-error TS7057
    const request = yield select(fromUser.getLoadSubresourcesRequest);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        // @ts-expect-error TS7057
        return yield put(loadSubresourcesError(error));
    }

    // @ts-expect-error TS7057
    return yield put(loadSubresourcesSuccess(response));
}

// @ts-expect-error TS7031
export function* handleCreateSubresource({ payload: { resource, callback } }) {
    // @ts-expect-error TS7057
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

    // @ts-expect-error TS7057
    return yield put(loadSubresources());
}

// @ts-expect-error TS7031
export function* handleUpdateSubresource({ payload: resource }) {
    // @ts-expect-error TS7057
    const request = yield select(
        fromUser.getUpdateSubresourceRequest,
        resource,
    );
    const { error, response } = yield call(fetchSaga, request);
    if (error) {
        return;
    }

    yield put(updateSubresourceOptimistic(response));
    yield put(loadPublication({ forcePostComputation: true }));

    // @ts-expect-error TS7057
    return yield put(loadSubresources());
}

// @ts-expect-error TS7031
export function* handleDeleteSubresource({ payload: id }) {
    // @ts-expect-error TS7057
    const request = yield select(fromUser.getDeleteSubresourceRequest, id);
    const { error } = yield call(fetchSaga, request);
    if (error) {
        return;
    }

    // @ts-expect-error TS7057
    return yield put(loadSubresources());
}

export function* watchLoadSubresourcesRequest() {
    yield takeLatest(
        [LOAD_SUBRESOURCES, IMPORT_FIELDS_SUCCESS],
        handleLoadSubresourcesRequest,
    );
}

export function* watchCreateSubresource() {
    // @ts-expect-error TS2769
    yield takeLatest(CREATE_SUBRESOURCE, handleCreateSubresource);
}

export function* watchUpdateSubresource() {
    // @ts-expect-error TS2769
    yield takeLatest(UPDATE_SUBRESOURCE, handleUpdateSubresource);
}

export function* watchDeleteSubresource() {
    // @ts-expect-error TS2769
    yield takeLatest(DELETE_SUBRESOURCE, handleDeleteSubresource);
}

export default function* () {
    yield fork(watchLoadSubresourcesRequest);
    yield fork(watchCreateSubresource);
    yield fork(watchUpdateSubresource);
    yield fork(watchDeleteSubresource);
}
