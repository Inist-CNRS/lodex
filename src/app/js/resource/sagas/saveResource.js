import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import {
    saveResourceSuccess,
    saveResourceError,
    getResourceFormData,
    SAVE_RESOURCE,
} from '../';
import { getSaveResourceRequest } from '../../fetch';
import fetchSaga from '../../lib/fetchSaga';

export const parsePathName = pathname => pathname.match(/^(\/resource)(\/ark:\/)?(.*?$)/) || [];

export function* handleSaveResource() {
    const resource = yield select(getResourceFormData);
    const request = yield select(getSaveResourceRequest, resource);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(saveResourceError(error));
        return;
    }

    yield put(saveResourceSuccess(response));
    yield put(push({ pathname: '/resource', query: { uri: resource.uri } }));
}

export default function* watchSaveResource() {
    yield takeLatest(SAVE_RESOURCE, handleSaveResource);
}
