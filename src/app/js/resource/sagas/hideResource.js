import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import {
    getHideResourceRequest,
    hideResourceSuccess,
    hideResourceError,
    getHideResourceFormData,
    HIDE_RESOURCE,
} from '../';

import fetchSaga from '../../lib/fetchSaga';

export const parsePathName = pathname => pathname.match(/^(\/resource)(\/ark:\/)?(.*?$)/) || [];

export function* handleHideResource() {
    const resource = yield select(getHideResourceFormData);
    const request = yield select(getHideResourceRequest, resource);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(hideResourceError(error));
        return;
    }

    yield put(hideResourceSuccess(response));
    yield put(push({ pathname: '/resource', query: { uri: resource.uri } }));
}

export default function* watchLoadDatasetPageRequest() {
    yield takeLatest(HIDE_RESOURCE, handleHideResource);
}
