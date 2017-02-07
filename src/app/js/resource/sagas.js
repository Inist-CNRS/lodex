import { takeLatest } from 'redux-saga';
import { call, fork, put, select } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import {
    getLoadResourceRequest,
    loadResource,
    loadResourceSuccess,
    loadResourceError,
} from './';
import { loadPublication } from '../publication';

import fetchSaga from '../lib/fetchSaga';

export const parsePathName = pathname => pathname.match(/^(\/resource)(\/ark:\/)?(.*?$)/) || [];

export function* handleLoadResource({ payload }) {
    const [, name, isArk, ark] = yield call(parsePathName, payload.pathname);

    if (name !== '/resource') {
        return;
    }

    yield put(loadResource());
    const uri = isArk ? ark : payload.query.uri;

    const request = yield select(getLoadResourceRequest, uri);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(loadResourceError(error));
        return;
    }

    yield put(loadResourceSuccess(response));
    yield put(loadPublication());
}

export function* watchLoadDatasetPageRequest() {
    yield takeLatest(LOCATION_CHANGE, handleLoadResource);
}

export default function* () {
    yield fork(watchLoadDatasetPageRequest);
}
