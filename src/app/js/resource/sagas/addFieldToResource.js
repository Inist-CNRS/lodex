import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import {
    addFieldToResourceSuccess,
    addFieldToResourceError,
    getNewResourceFieldFormData,
    ADD_FIELD_TO_RESOURCE,
} from '../';
import { getAddFieldToResourceRequest } from '../../fetch';
import fetchSaga from '../../lib/fetchSaga';

export const parsePathName = pathname => pathname.match(/^(\/resource)(\/ark:\/)?(.*?$)/) || [];

export function* handleAddFieldToResource({ payload: uri }) {
    const formData = yield select(getNewResourceFieldFormData);
    const request = yield select(getAddFieldToResourceRequest, {
        ...formData,
        uri,
    });
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(addFieldToResourceError(error));
        return;
    }

    yield put(addFieldToResourceSuccess(response));
    yield put(push({ pathname: '/resource', query: { uri } }));
}

export default function* watchAddFieldToResource() {
    yield takeLatest(ADD_FIELD_TO_RESOURCE, handleAddFieldToResource);
}
