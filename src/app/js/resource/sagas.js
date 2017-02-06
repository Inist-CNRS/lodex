import { takeLatest } from 'redux-saga';
import { call, fork, put, select } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import {
    getLoadResourceRequest,
    loadResourceSuccess,
    loadResourceError,
} from './';
import { loadField } from '../admin/fields';
import fetchSaga from '../lib/fetchSaga';

const parsePathName = pathname => pathname.match(/^(\/resource)(\/ark:\/)?(.*?$)/) || [];

export function* handleLoadResource({ payload }) {
    const [, name, isArk, ark] = yield call(parsePathName, payload.pathname);

    if (name !== '/resource') {
        return;
    }

    const uri = isArk ? ark : payload.query.uri;

    const request = yield select(getLoadResourceRequest, uri);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(loadResourceError(error));
        return;
    }

    yield put(loadResourceSuccess(response));
    yield put(loadField());
}

export function* watchLoadDatasetPageRequest() {
    yield takeLatest(LOCATION_CHANGE, handleLoadResource);
}

export default function* () {
    yield fork(watchLoadDatasetPageRequest);
}
